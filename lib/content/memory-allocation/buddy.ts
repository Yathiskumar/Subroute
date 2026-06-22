import type { ConceptContent } from "@/lib/content/types";

export const buddy: ConceptContent = {
  prototypeCaption:
    "The buddy system manages memory as **power-of-two blocks**. A request is rounded up to the next power of two; a large free block is **split in half** repeatedly until it's the right size; the unused half of each split is the block's **buddy**. On free, a block **merges** with its buddy whenever the buddy is also free — found with a single XOR of the address. Scenario **1 · Split & merge** runs allocs and frees; scenario **2 · Full merge cascade** shows blocks coalescing all the way back to the whole heap.",

  overview: [
    {
      type: "p",
      text: "The buddy system is a structured allocator that trades a little wasted space for very fast allocation and, especially, very fast **coalescing**. All blocks are powers of two in size. Memory starts as one giant block; to satisfy a request, the allocator rounds the request up to the nearest power of two and, if the smallest available block is too big, **splits** it in half — and halves again — until it has a block of exactly the right size.",
    },
    {
      type: "p",
      text: "When a block is split, the two halves are **buddies**. The defining trick is that a block's buddy is found by a single XOR: `buddyAddress = blockAddress XOR blockSize`. That makes the reverse operation — merging — almost free. When a block is freed, the allocator checks whether its buddy is also free; if so, the two coalesce back into the larger block, and that block checks *its* buddy, cascading upward until no further merge is possible.",
    },
    {
      type: "p",
      text: "This is why Linux uses a buddy system for its **page allocator**: physical memory is handed out in power-of-two runs of pages, and when memory is freed, large contiguous regions reassemble quickly so the next big request can be served. The cost is **internal fragmentation** — rounding a 100K request up to 128K wastes 28K *inside* the block — which the slab allocator (layered on top) exists partly to mitigate.",
    },
  ],

  howItWorks: [
    { type: "h", text: "Allocation: round up, then split down" },
    {
      type: "ol",
      items: [
        "**Round the request up** to the next power of two (bounded below by a minimum block size). A 100K request becomes a 128K block.",
        "**Find the smallest free block** that is at least that size. Free blocks are kept in lists segregated by size (one list per power of two), so this lookup is fast.",
        "**Split down to size.** If the block is bigger than needed, split it into two equal buddies, keep one, and put the other on the free list for its size. Repeat until the block is exactly the rounded-up size.",
        "**Hand it out.** The requester gets a power-of-two block; the difference between the rounded size and the actual request is internal fragmentation.",
      ],
    },
    { type: "h", text: "Free: merge with the buddy" },
    {
      type: "ol",
      items: [
        "**Compute the buddy address** with `addr XOR size`. Because blocks are power-of-two aligned, this flips exactly the bit that distinguishes the two halves.",
        "**Check the buddy's state.** If the buddy is free *and* whole (not itself split), the two can merge.",
        "**Merge and ascend.** Combine the two halves into the larger block, then repeat the buddy check at the next size up — coalescing cascades as far as it can.",
        "**Stop** when the buddy is busy, is split into smaller pieces still in use, or the whole heap has reassembled.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Why the XOR works",
      text: "Two buddies of size S occupy addresses that differ only in the bit with value S (because they were created by splitting an aligned 2S block). XOR-ing an address with S flips that one bit, turning a block's address into its buddy's and vice versa. So finding a buddy is one instruction, and the allocator never has to search — coalescing is O(1) per level, O(log n) total.",
    },
    {
      type: "callout",
      variant: "warning",
      title: "Internal fragmentation is the price",
      text: "Because every allocation is rounded up to a power of two, a request just over a boundary wastes nearly half the block. A 257K request takes a 512K block — 255K wasted *inside*. This is internal fragmentation, and it's the buddy system's characteristic cost, accepted in exchange for fast splitting and merging.",
    },
  ],

  whenToUse: [
    { type: "h", text: "When the buddy system shines" },
    {
      type: "ul",
      items: [
        "**Page-level allocation in a kernel** — Linux's physical page allocator is a buddy system; power-of-two page runs and fast coalescing are exactly what it needs.",
        "**Fast coalescing is a priority** — if you free and re-allocate large blocks frequently and need them to reassemble quickly, the XOR-and-merge is hard to beat.",
        "**Allocation sizes cluster near powers of two** — when requests are already close to powers of two, the internal-fragmentation cost is small.",
        "**Avoid it for many odd-sized small objects** — the rounding waste becomes severe; layer a **slab allocator** on top instead (which is exactly what real kernels do).",
      ],
    },
    {
      type: "callout",
      variant: "info",
      title: "Real-world example",
      text: "The **Linux kernel** allocates physical memory with a buddy allocator operating on orders (order-0 is one page, order-1 is two pages, and so on up the powers of two). Freed page runs coalesce upward so high-order allocations can succeed. On top of the buddy allocator sits the **slab/SLUB** allocator, which carves those pages into right-sized object caches — the buddy system handles pages, slab handles objects.",
    },
  ],

  tradeoffs: {
    pros: [
      "**O(1) buddy lookup, O(log n) coalescing** — merging is a single XOR plus a list operation per level.",
      "**Fast splitting** — find the smallest block and halve down a known number of steps.",
      "**Limited, predictable external fragmentation** — free space reassembles into large blocks readily.",
      "**Simple free lists** — one list per power-of-two size class.",
    ],
    cons: [
      "**Internal fragmentation** — rounding every request up to a power of two can waste up to nearly half a block.",
      "**Coarse size classes** — only power-of-two sizes exist; there's no 192K block, only 128K or 256K.",
      "**Merges can be blocked** — two free blocks that aren't buddies (busy blocks between them) can't coalesce.",
      "**Not ideal for many small odd-sized objects** — needs a slab layer on top to be space-efficient there.",
    ],
  },

  handsOn: [
    {
      title: "01 · Watch a request split down to size",
      body: "On scenario **1 · Split & merge**, step through the first allocation: P1 requests 100K, which rounds up to **128K**. The allocator finds the 1024K block and splits it 1024 → 512 → 256 → 128, keeping the left half each time. Watch the gray 'internal fragmentation' segment appear inside P1's block — 28K wasted because 100K had to round up to 128K.",
    },
    {
      title: "02 · See a buddy merge — and a blocked one",
      body: "Keep stepping into the **free P3** and **free P1** operations. Freeing P3 lets its 64K block merge with its free buddy back into 128K, but that block's buddy (P1) is busy, so it stops. After freeing P1, two 256K free blocks remain — but they sit on opposite sides of P2 and P4, so they *can't* merge (not buddies). Watch the free-list summary and the 'can't merge' narration.",
    },
    {
      title: "03 · Trigger a full coalescing cascade",
      body: "Switch to scenario **2 · Full merge cascade**. Allocate two 200K blocks (each rounds to 256K), then free them in order. Freeing the second block sets off a cascade: 256+256 merges to 512, then 512+512 merges back to the full **1024K** heap. Step slowly to watch each XOR-driven merge, then hit Auto to see the whole cascade run.",
    },
  ],

  codeSamples: [
    {
      label: "Go",
      language: "go",
      filename: "buddy.go",
      code: `package alloc

const MIN = 64

func nextPow2(n int) int {
	p := MIN
	for p < n {
		p *= 2
	}
	return p
}

type Block struct {
	Start int
	Size  int
	Free  bool
}

// buddyAddress finds the buddy of a block: flip the single bit equal to its size.
func buddyAddress(start, size int) int {
	return start ^ size // XOR — O(1), no search
}

// freeAndMerge coalesces upward while the buddy is also free.
func freeAndMerge(blocks map[int]Block, start, size, total int) {
	s, sz := start, size
	for sz < total {
		b := buddyAddress(s, sz)
		buddy, ok := blocks[b]
		if !ok || !buddy.Free || buddy.Size != sz { // buddy busy/split → stop
			break
		}
		delete(blocks, b)
		delete(blocks, s)
		if b < s { // merged block starts at the lower address
			s = b
		}
		sz *= 2 // ascend one size class and check again
	}
	blocks[s] = Block{Start: s, Size: sz, Free: true}
}`,
    },
    {
      label: "Java",
      language: "java",
      filename: "Buddy.java",
      code: `import java.util.Map;

class Block {
    int start, size;
    boolean free;
    Block(int start, int size, boolean free) { this.start = start; this.size = size; this.free = free; }
}

class Buddy {
    static final int MIN = 64;

    static int nextPow2(int n) {
        int p = MIN;
        while (p < n) p *= 2;
        return p;
    }

    /** The buddy of a block: flip the single bit equal to its size. */
    static int buddyAddress(int start, int size) {
        return start ^ size;          // XOR — O(1), no search
    }

    /** On free, coalesce upward while the buddy is also free. */
    static void freeAndMerge(Map<Integer, Block> blocks, int start, int size, int total) {
        int s = start, sz = size;
        while (sz < total) {
            int b = buddyAddress(s, sz);
            Block buddy = blocks.get(b);
            if (buddy == null || !buddy.free || buddy.size != sz) break; // buddy busy/split → stop
            blocks.remove(b);
            blocks.remove(s);
            s = Math.min(s, b);       // merged block starts at the lower address
            sz *= 2;                  // ascend one size class and check again
        }
        blocks.put(s, new Block(s, sz, true));
    }
}`,
    },
    {
      label: "Python",
      language: "python",
      filename: "buddy.py",
      code: `from dataclasses import dataclass

MIN = 64


def next_pow2(n: int) -> int:
    p = MIN
    while p < n:
        p *= 2
    return p


@dataclass
class Block:
    start: int
    size: int
    free: bool


def buddy_address(start: int, size: int) -> int:
    """The buddy of a block: flip the single bit equal to its size."""
    return start ^ size              # XOR — O(1), no search


def free_and_merge(blocks: dict[int, Block], start: int, size: int, total: int) -> None:
    """On free, coalesce upward while the buddy is also free."""
    s, sz = start, size
    while sz < total:
        b = buddy_address(s, sz)
        buddy = blocks.get(b)
        if buddy is None or not buddy.free or buddy.size != sz:  # buddy busy/split → stop
            break
        del blocks[b]
        del blocks[s]
        s = min(s, b)                # merged block starts at the lower address
        sz *= 2                      # ascend one size class and check again
    blocks[s] = Block(start=s, size=sz, free=True)`,
    },
    {
      label: "C++",
      language: "cpp",
      filename: "buddy.cpp",
      code: `#include <algorithm>
#include <unordered_map>

constexpr int MIN = 64;

int nextPow2(int n) {
    int p = MIN;
    while (p < n) p *= 2;
    return p;
}

struct Block {
    int start;
    int size;
    bool free;
};

// The buddy of a block: flip the single bit equal to its size.
int buddyAddress(int start, int size) {
    return start ^ size;          // XOR — O(1), no search
}

// On free, coalesce upward while the buddy is also free.
void freeAndMerge(std::unordered_map<int, Block>& blocks, int start, int size, int total) {
    int s = start, sz = size;
    while (sz < total) {
        int b = buddyAddress(s, sz);
        auto it = blocks.find(b);
        if (it == blocks.end() || !it->second.free || it->second.size != sz)
            break;                // buddy busy/split → stop
        blocks.erase(b);
        blocks.erase(s);
        s = std::min(s, b);       // merged block starts at the lower address
        sz *= 2;                  // ascend one size class and check again
    }
    blocks[s] = Block{s, sz, true};
}`,
    },
  ],

  furtherReading: [
    {
      label: "Buddy memory allocation — Wikipedia",
      href: "https://en.wikipedia.org/wiki/Buddy_memory_allocation",
      kind: "article",
      note: "Clear walkthrough of splitting, the XOR buddy trick, and merging — a great first read.",
    },
    {
      label: "Understanding the Linux VMM (Mel Gorman) — Ch. 6: Physical Page Allocation",
      href: "https://www.kernel.org/doc/gorman/html/understand/understand009.html",
      kind: "book",
      note: "A thorough, free walkthrough of the kernel's binary buddy allocator, its per-order free lists, and coalescing.",
    },
    {
      label: "OSTEP — Free-Space Management (Chapter 17)",
      href: "https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf",
      kind: "book",
      note: "The 'Other Approaches' section explains the buddy system and why power-of-two blocks make coalescing cheap.",
    },
    {
      label: "Linux kernel — Memory Allocation Guide",
      href: "https://docs.kernel.org/core-api/memory-allocation.html",
      kind: "docs",
      note: "Official docs: how `alloc_pages` and friends sit on top of the buddy allocator in a real kernel.",
    },
    {
      label: "Knuth — The Art of Computer Programming, Vol. 1 (§2.5)",
      href: "https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming",
      kind: "book",
      note: "The original description and analysis of the buddy system.",
    },
  ],

  quiz: [
    {
      id: "bud-q1",
      question: "How does the buddy system find a freed block's buddy?",
      options: [
        { id: "a", label: "By scanning the entire free list." },
        { id: "b", label: "By XOR-ing the block's address with its size — flipping the one bit that distinguishes the two halves." },
        { id: "c", label: "By searching a balanced tree." },
        { id: "d", label: "By following a pointer stored in the block header." },
      ],
      correctOptionId: "b",
      explanation:
        "Buddies of size S differ only in the bit valued S. `address XOR size` flips exactly that bit, giving the buddy's address in one operation — which is what makes coalescing so fast.",
    },
    {
      id: "bud-q2",
      question: "What is the buddy system's characteristic source of waste?",
      options: [
        { id: "a", label: "External fragmentation between blocks." },
        { id: "b", label: "Internal fragmentation — rounding each request up to a power of two wastes space inside the block." },
        { id: "c", label: "Reference-count overhead." },
        { id: "d", label: "Tiny slivers from tight fits." },
      ],
      correctOptionId: "b",
      explanation:
        "Every request is rounded up to a power of two, so a 100K request takes a 128K block, wasting 28K inside it. That internal fragmentation is the price of fast splitting and merging.",
    },
    {
      id: "bud-q3",
      question:
        "After freeing two blocks, why might two adjacent free blocks still fail to merge?",
      options: [
        { id: "a", label: "Because merging is disabled after the first allocation." },
        { id: "b", label: "Because they are not buddies — they weren't created by splitting the same parent, so their XOR relationship doesn't hold." },
        { id: "c", label: "Because the free list is full." },
        { id: "d", label: "Because they have different reference counts." },
      ],
      correctOptionId: "b",
      explanation:
        "Only true buddies (the two halves of one split) can merge. Two free blocks separated by busy blocks, or that descend from different parents, aren't buddies — so the XOR check fails and they stay separate.",
    },
  ],
};
