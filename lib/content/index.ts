import type { ConceptContent, TopicContent } from "./types";
import { tokenBucket } from "./rate-limiting/token-bucket";
import { leakyBucket } from "./rate-limiting/leaky-bucket";
import { fixedWindow } from "./rate-limiting/fixed-window";
import { slidingWindow } from "./rate-limiting/sliding-window";
import { slidingLog } from "./rate-limiting/sliding-log";
import { rateLimitingTopic } from "./rate-limiting/_topic";
import { cacheEvictionTopic } from "./cache-eviction/_topic";
import { cacheWriteTopic } from "./cache-write/_topic";
import { writeThrough } from "./cache-write/write-through";
import { writeBack } from "./cache-write/write-back";
import { writeAround } from "./cache-write/write-around";
import { lfu } from "./cache-eviction/lfu";
import { lru } from "./cache-eviction/lru";
import { mru } from "./cache-eviction/mru";
import { fifo } from "./cache-eviction/fifo";
import { random } from "./cache-eviction/random";
import { ttl } from "./cache-eviction/ttl";
import { clock } from "./cache-eviction/clock";
import { twoQ } from "./cache-eviction/2q";
import { arc } from "./cache-eviction/arc";
import { lirs } from "./cache-eviction/lirs";
import { garbageCollectionTopic } from "./garbage-collection/_topic";
import { referenceCounting } from "./garbage-collection/reference-counting";
import { markSweep } from "./garbage-collection/mark-sweep";
import { markCompact } from "./garbage-collection/mark-compact";
import { copyingCheney } from "./garbage-collection/copying-cheney";
import { generational } from "./garbage-collection/generational";
import { triColor } from "./garbage-collection/tri-color";
import { incremental } from "./garbage-collection/incremental";
import { concurrentMarkSweep } from "./garbage-collection/concurrent-mark-sweep";
import { memoryAllocationTopic } from "./memory-allocation/_topic";
import { firstFit } from "./memory-allocation/first-fit";
import { bestFit } from "./memory-allocation/best-fit";
import { worstFit } from "./memory-allocation/worst-fit";
import { nextFit } from "./memory-allocation/next-fit";
import { buddy } from "./memory-allocation/buddy";
import { slab } from "./memory-allocation/slab";
import { loadBalancingTopic } from "./load-balancing/_topic";
import { roundRobin } from "./load-balancing/round-robin";
import { weightedRoundRobin } from "./load-balancing/weighted-round-robin";
import { random as lbRandom } from "./load-balancing/random";
import { leastConnections } from "./load-balancing/least-connections";
import { weightedLeastConnections } from "./load-balancing/weighted-least-connections";
import { leastResponseTime } from "./load-balancing/least-response-time";
import { ewma } from "./load-balancing/ewma";
import { ipHash } from "./load-balancing/ip-hash";
import { powerOfTwoChoices } from "./load-balancing/power-of-two-choices";
import { consistentHashingTopic } from "./consistent-hashing/_topic";
import { vanillaRing } from "./consistent-hashing/vanilla-ring";
import { virtualNodes } from "./consistent-hashing/virtual-nodes";
import { rendezvousHrw } from "./consistent-hashing/rendezvous-hrw";
import { jumpHash } from "./consistent-hashing/jump-hash";
import { maglev } from "./consistent-hashing/maglev";
import { pageReplacementTopic } from "./page-replacement/_topic";
import { fifo as prFifo } from "./page-replacement/fifo";
import { optimal as prOptimal } from "./page-replacement/optimal";
import { lru as prLru } from "./page-replacement/lru";
import { secondChance as prSecondChance } from "./page-replacement/second-chance";
import { clock as prClock } from "./page-replacement/clock";
import { nru as prNru } from "./page-replacement/nru";
import { aging as prAging } from "./page-replacement/aging";
import { lfu as prLfu } from "./page-replacement/lfu";
import { circuitBreakerTopic } from "./circuit-breaker/_topic";
import { stateMachine as cbStateMachine } from "./circuit-breaker/state-machine";
import { countBased as cbCountBased } from "./circuit-breaker/count-based";
import { timeBased as cbTimeBased } from "./circuit-breaker/time-based";
import { slowCallRate as cbSlowCallRate } from "./circuit-breaker/slow-call-rate";
import { errorPercentage as cbErrorPercentage } from "./circuit-breaker/error-percentage";
import { adaptive as cbAdaptive } from "./circuit-breaker/adaptive";
import { bloomFiltersTopic } from "./bloom-filters/_topic";
import { bloom } from "./bloom-filters/bloom";
import { countingBloom } from "./bloom-filters/counting-bloom";
import { cuckoo } from "./bloom-filters/cuckoo";
import { consensusTopic } from "./consensus/_topic";
import { twoPhaseCommit } from "./consensus/two-phase-commit";
import { threePhaseCommit } from "./consensus/three-phase-commit";
import { paxos } from "./consensus/paxos";
import { multiPaxos } from "./consensus/multi-paxos";
import { raft } from "./consensus/raft";
import { zab } from "./consensus/zab";
import { pbft } from "./consensus/pbft";
import { leaderElectionTopic } from "./leader-election/_topic";
import { bully } from "./leader-election/bully";
import { ring as leRing } from "./leader-election/ring";
import { raftElection } from "./leader-election/raft-election";
import { leaseBased } from "./leader-election/lease-based";
import { zookeeper as leZookeeper } from "./leader-election/zookeeper";
import { sortingTopic } from "./sorting/_topic";
import { bubble as sBubble } from "./sorting/bubble";
import { selection as sSelection } from "./sorting/selection";
import { insertion as sInsertion } from "./sorting/insertion";
import { merge as sMerge } from "./sorting/merge";
import { quick as sQuick } from "./sorting/quick";
import { heap as sHeap } from "./sorting/heap";
import { counting as sCounting } from "./sorting/counting";
import { radix as sRadix } from "./sorting/radix";
import { bucket as sBucket } from "./sorting/bucket";
import { timsort as sTimsort } from "./sorting/timsort";
import { graphAlgorithmsTopic } from "./graph-algorithms/_topic";
import { bfs as gaBfs } from "./graph-algorithms/bfs";
import { dfs as gaDfs } from "./graph-algorithms/dfs";
import { topologicalSort as gaTopoSort } from "./graph-algorithms/topological-sort";
import { dijkstra as gaDijkstra } from "./graph-algorithms/dijkstra";
import { bellmanFord as gaBellmanFord } from "./graph-algorithms/bellman-ford";
import { floydWarshall as gaFloydWarshall } from "./graph-algorithms/floyd-warshall";
import { unionFind as gaUnionFind } from "./graph-algorithms/union-find";
import { kruskal as gaKruskal } from "./graph-algorithms/kruskal";
import { prim as gaPrim } from "./graph-algorithms/prim";
import { astar as gaAstar } from "./graph-algorithms/astar";
import { treesTopic } from "./trees/_topic";
import { bst as tBst } from "./trees/bst";
import { avl as tAvl } from "./trees/avl";
import { redBlack as tRedBlack } from "./trees/red-black";
import { heap as tHeap } from "./trees/heap";
import { trie as tTrie } from "./trees/trie";
import { bTree as tBTree } from "./trees/b-tree";
import { bPlusTree as tBPlusTree } from "./trees/b-plus-tree";
import { segmentTree as tSegmentTree } from "./trees/segment-tree";
import { fenwickTree as tFenwickTree } from "./trees/fenwick-tree";
import { graphTheoryTopic } from "./graph-theory/_topic";
import { undirectedGraph as gtUndirected } from "./graph-theory/undirected-graph";
import { directedGraph as gtDirected } from "./graph-theory/directed-graph";
import { unweightedGraph as gtUnweighted } from "./graph-theory/unweighted-graph";
import { weightedGraph as gtWeighted } from "./graph-theory/weighted-graph";
import { completeGraph as gtComplete } from "./graph-theory/complete-graph";
import { bipartiteGraph as gtBipartite } from "./graph-theory/bipartite-graph";
import { cyclicGraph as gtCyclic } from "./graph-theory/cyclic-graph";
import { dag as gtDag } from "./graph-theory/dag";

// Indexed by `${topicSlug}/${conceptSlug}`
const CONCEPT_CONTENT: Record<string, ConceptContent> = {
  "rate-limiting/token-bucket": tokenBucket,
  "rate-limiting/leaky-bucket": leakyBucket,
  "rate-limiting/fixed-window": fixedWindow,
  "rate-limiting/sliding-window": slidingWindow,
  "rate-limiting/sliding-log": slidingLog,
  "cache-write/write-through": writeThrough,
  "cache-write/write-back": writeBack,
  "cache-write/write-around": writeAround,
  "cache-eviction/lfu": lfu,
  "cache-eviction/lru": lru,
  "cache-eviction/mru": mru,
  "cache-eviction/fifo": fifo,
  "cache-eviction/random": random,
  "cache-eviction/ttl": ttl,
  "cache-eviction/clock": clock,
  "cache-eviction/2q": twoQ,
  "cache-eviction/arc": arc,
  "cache-eviction/lirs": lirs,
  "garbage-collection/reference-counting": referenceCounting,
  "garbage-collection/mark-sweep": markSweep,
  "garbage-collection/mark-compact": markCompact,
  "garbage-collection/copying-cheney": copyingCheney,
  "garbage-collection/generational": generational,
  "garbage-collection/tri-color": triColor,
  "garbage-collection/incremental": incremental,
  "garbage-collection/concurrent-mark-sweep": concurrentMarkSweep,
  "memory-allocation/first-fit": firstFit,
  "memory-allocation/best-fit": bestFit,
  "memory-allocation/worst-fit": worstFit,
  "memory-allocation/next-fit": nextFit,
  "memory-allocation/buddy": buddy,
  "memory-allocation/slab": slab,
  "load-balancing/round-robin": roundRobin,
  "load-balancing/weighted-round-robin": weightedRoundRobin,
  "load-balancing/random": lbRandom,
  "load-balancing/least-connections": leastConnections,
  "load-balancing/weighted-least-connections": weightedLeastConnections,
  "load-balancing/least-response-time": leastResponseTime,
  "load-balancing/ewma": ewma,
  "load-balancing/ip-hash": ipHash,
  "load-balancing/power-of-two-choices": powerOfTwoChoices,
  "consistent-hashing/vanilla-ring": vanillaRing,
  "consistent-hashing/virtual-nodes": virtualNodes,
  "consistent-hashing/rendezvous-hrw": rendezvousHrw,
  "consistent-hashing/jump-hash": jumpHash,
  "consistent-hashing/maglev": maglev,
  "page-replacement/fifo": prFifo,
  "page-replacement/optimal": prOptimal,
  "page-replacement/lru": prLru,
  "page-replacement/second-chance": prSecondChance,
  "page-replacement/clock": prClock,
  "page-replacement/nru": prNru,
  "page-replacement/aging": prAging,
  "page-replacement/lfu": prLfu,
  "circuit-breaker/state-machine": cbStateMachine,
  "circuit-breaker/count-based": cbCountBased,
  "circuit-breaker/time-based": cbTimeBased,
  "circuit-breaker/slow-call-rate": cbSlowCallRate,
  "circuit-breaker/error-percentage": cbErrorPercentage,
  "circuit-breaker/adaptive": cbAdaptive,
  "bloom-filters/bloom": bloom,
  "bloom-filters/counting-bloom": countingBloom,
  "bloom-filters/cuckoo": cuckoo,
  "consensus/two-phase-commit": twoPhaseCommit,
  "consensus/three-phase-commit": threePhaseCommit,
  "consensus/paxos": paxos,
  "consensus/multi-paxos": multiPaxos,
  "consensus/raft": raft,
  "consensus/zab": zab,
  "consensus/pbft": pbft,
  "leader-election/bully": bully,
  "leader-election/ring": leRing,
  "leader-election/raft-election": raftElection,
  "leader-election/lease-based": leaseBased,
  "leader-election/zookeeper": leZookeeper,
  "sorting/bubble": sBubble,
  "sorting/selection": sSelection,
  "sorting/insertion": sInsertion,
  "sorting/merge": sMerge,
  "sorting/quick": sQuick,
  "sorting/heap": sHeap,
  "sorting/counting": sCounting,
  "sorting/radix": sRadix,
  "sorting/bucket": sBucket,
  "sorting/timsort": sTimsort,
  "graph-algorithms/bfs": gaBfs,
  "graph-algorithms/dfs": gaDfs,
  "graph-algorithms/topological-sort": gaTopoSort,
  "graph-algorithms/dijkstra": gaDijkstra,
  "graph-algorithms/bellman-ford": gaBellmanFord,
  "graph-algorithms/floyd-warshall": gaFloydWarshall,
  "graph-algorithms/union-find": gaUnionFind,
  "graph-algorithms/kruskal": gaKruskal,
  "graph-algorithms/prim": gaPrim,
  "graph-algorithms/astar": gaAstar,
  "trees/bst": tBst,
  "trees/avl": tAvl,
  "trees/red-black": tRedBlack,
  "trees/heap": tHeap,
  "trees/trie": tTrie,
  "trees/b-tree": tBTree,
  "trees/b-plus-tree": tBPlusTree,
  "trees/segment-tree": tSegmentTree,
  "trees/fenwick-tree": tFenwickTree,
  "graph-theory/undirected-graph": gtUndirected,
  "graph-theory/directed-graph": gtDirected,
  "graph-theory/unweighted-graph": gtUnweighted,
  "graph-theory/weighted-graph": gtWeighted,
  "graph-theory/complete-graph": gtComplete,
  "graph-theory/bipartite-graph": gtBipartite,
  "graph-theory/cyclic-graph": gtCyclic,
  "graph-theory/dag": gtDag,
};

// Indexed by topic slug
const TOPIC_CONTENT: Record<string, TopicContent> = {
  "rate-limiting": rateLimitingTopic,
  "cache-write": cacheWriteTopic,
  "cache-eviction": cacheEvictionTopic,
  "garbage-collection": garbageCollectionTopic,
  "memory-allocation": memoryAllocationTopic,
  "load-balancing": loadBalancingTopic,
  "consistent-hashing": consistentHashingTopic,
  "page-replacement": pageReplacementTopic,
  "circuit-breaker": circuitBreakerTopic,
  "bloom-filters": bloomFiltersTopic,
  "consensus": consensusTopic,
  "leader-election": leaderElectionTopic,
  "sorting": sortingTopic,
  "graph-algorithms": graphAlgorithmsTopic,
  "trees": treesTopic,
  "graph-theory": graphTheoryTopic,
};

export function getConceptContent(
  topicSlug: string,
  conceptSlug: string,
): ConceptContent | null {
  return CONCEPT_CONTENT[`${topicSlug}/${conceptSlug}`] ?? null;
}

export function getTopicContent(topicSlug: string): TopicContent | null {
  return TOPIC_CONTENT[topicSlug] ?? null;
}

/** Aggregate counts across all authored concept content (for site stats). */
export function getContentStats(): {
  references: number;
  quizQuestions: number;
} {
  let references = 0;
  let quizQuestions = 0;
  for (const content of Object.values(CONCEPT_CONTENT)) {
    references += content.furtherReading?.length ?? 0;
    quizQuestions += content.quiz?.length ?? 0;
  }
  return { references, quizQuestions };
}
