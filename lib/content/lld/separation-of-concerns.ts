import type { RoadmapLesson } from "@/lib/content/types";

export const separationOfConcerns: RoadmapLesson = {
  title: "Separation of Concerns",
  oneLiner:
    "Split a program so each part handles ONE concern — one reason to care — and the parts overlap as little as possible. A 'concern' is a distinct job: checking input, applying business rules, talking to the database, formatting the output. Keep them apart and you can change or test one without breaking the others.",
  difficulty: "beginner",
  estimatedTime: "14 min",
  prototypePath: "/prototypes/lld/separation-of-concerns.html",
  content: {
    prototypeCaption:
      "One `handleSignup()` function whose body is a tangle of four colored concerns — *validation* (blue), *business rules* (orange), *data access* (green), and *presentation* (violet) — all interleaved on the same lines, with a live readout: *concerns crammed in: 4*. Press **Separate concerns** and the lines sort themselves into four clean stacked lanes, each now a single-concern module showing *concerns: 1*. Click any lane and the one fixed panel tells you exactly what a change to that concern now touches — *swap the DB → only Data Access changes; the other three are untouched*. One panel, replaced each click; nothing scrolls away.",

    overview: [
      {
        type: "p",
        text: "**Separation of Concerns** is a simple idea: split your program so each part has *one* job. A **concern** is one distinct thing the program has to care about — checking the input is valid, applying the business rules, saving to the database, formatting what the user sees. When all of those jobs are crammed into one function, the function is doing too much. Pull each job into its own part, and let the parts touch as little as possible.",
      },
      {
        type: "p",
        text: "Think of a **restaurant**. The *waiter* takes your order. The *chef* cooks the food. The *cashier* handles the money. Each person has one concern and does it well. Now imagine *one* person trying to take orders, cook, and run the till all at once — orders get dropped, the food burns, the cash drawer is wrong. That is what a tangled function feels like. Separation of concerns is just giving each job to its own *role*.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The one sentence to remember",
        text: "One part, one concern — *one reason to care*. If you can describe what a part does without saying **'and'**, it probably has a single concern. If you keep saying 'it validates the input *and* saves to the DB *and* renders the page', that is three concerns wearing one coat.",
      },
      {
        type: "callout",
        variant: "info",
        title: "This is the umbrella over many rules you already know",
        text: "Separation of Concerns is the *big* idea that smaller rules are special cases of. The **Single Responsibility Principle** (a class should have one reason to change) is SoC at the class level. **MVC** (Model–View–Controller) is SoC for UI apps — data, display, and control kept apart. **Clean / layered architecture** is SoC across a whole system. Learn the umbrella and the rest click into place.",
      },
    ],

    howItWorks: [
      { type: "h", text: "What counts as a 'concern'" },
      {
        type: "p",
        text: "A concern is a *distinct aspect* of the work — one reason the code might need to change. In a typical request handler you can usually spot four:",
      },
      {
        type: "ul",
        items: [
          "**Validation** — is the input well-formed and allowed? (empty email? password too short?)",
          "**Business logic** — the actual rules of your product. (a new user starts on the free plan; block disposable email domains)",
          "**Data access** — talking to storage. (insert the row, read it back, handle a duplicate key)",
          "**Presentation** — shaping the output. (build the JSON, render the HTML, pick the status code)",
        ],
      },
      {
        type: "p",
        text: "Each of these changes for a *different reason* and at a *different time*. The validation rules come from product. The database choice comes from infrastructure. The page layout comes from design. When they share a function, a change to any one of them puts the others at risk.",
      },
      { type: "h", text: "The smell: one function doing everything" },
      {
        type: "p",
        text: "Here is the trap, and it is the natural first draft everyone writes — the four concerns interleaved line by line:",
      },
      {
        type: "code",
        language: "typescript",
        code: `function handleSignup(req) {
  if (!req.email.includes("@")) return res(400, "bad email");   // validation
  if (req.password.length < 8)  return res(400, "weak password"); // validation
  const plan = "free";                                            // business
  if (blocked(req.email))       return res(403, "blocked domain");// business
  db.query("INSERT INTO users (email, plan) VALUES (?, ?)",       // data access
           [req.email, plan]);
  const user = db.query("SELECT * FROM users WHERE email = ?",    // data access
                        [req.email]);
  return res(200, "<h1>Welcome, " + user.email + "!</h1>");       // presentation
}`,
      },
      {
        type: "p",
        text: "It works. But it is *welded together*. Want to move from MySQL to Postgres? You are editing the same function that holds your validation and your HTML. Want to unit-test the signup *rules* without a database? You can't — the rules and the `db.query` calls live on adjacent lines. Want to return JSON for a mobile app *and* HTML for the web? Now the presentation logic is tangled in too. **One concern can't move without disturbing the others.**",
      },
      { type: "h", text: "The fix: give each concern its own part" },
      {
        type: "p",
        text: "Pull each concern into its own module with a clear, narrow job. The handler becomes a short *coordinator* that calls them in order:",
      },
      {
        type: "code",
        language: "typescript",
        code: `// validation.ts  — one concern: is the input OK?
export function validateSignup(req) { /* ...checks, throws on bad... */ }

// signup-service.ts — one concern: the business rules
export function signup(email) { return users.create(email, "free"); }

// users-repo.ts — one concern: talking to storage
export const users = { create(email, plan) { /* db insert + read back */ } };

// presenter.ts — one concern: shaping the output
export function welcomeHtml(user) { return \`<h1>Welcome, \${user.email}!</h1>\`; }

// handler.ts — a thin coordinator that wires the concerns together
function handleSignup(req) {
  validateSignup(req);
  const user = signup(req.email);
  return res(200, welcomeHtml(user));
}`,
      },
      {
        type: "p",
        text: "Now each part has *one reason to change*. Swap the database? You touch only `users-repo.ts`. Tweak a validation rule? Only `validation.ts`. Add a JSON response? Add a presenter — the rules and storage never notice. The pieces are also *reusable* (the validator can guard other endpoints) and *testable in isolation* (test the business rules with a fake repo, no real database).",
      },
      { type: "h", text: "Layering: the most common way to separate" },
      {
        type: "p",
        text: "The classic shape is **layers**, stacked so each only talks to the one below it: **Presentation** (what the user sees) → **Domain / Business Logic** (your rules) → **Data Access** (storage). This is sometimes called *presentation–domain–data layering*. The point of the stack is that a concern is sealed off: the presentation layer never writes SQL, and the data layer never builds HTML.",
      },
      {
        type: "figure",
        svg: `<svg viewBox="0 0 620 300" width="100%" style="max-width:620px;display:block;margin:0 auto;font-family:ui-monospace,'SF Mono',Menlo,monospace" role="img" aria-label="Before and after diagram of separation of concerns. Before: one handleSignup box containing four interleaved colored concern lines. After: the same work split into four stacked single-concern layers — Presentation, Business Logic, Data Access — each a clean box.">
  <defs>
    <marker id="soc-down" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="11" refX="10" refY="4" orient="auto"><path d="M1,0 L11,4 L1,8 z" fill="#9099a8"/></marker>
  </defs>

  <text x="150" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#9099a8">BEFORE — tangled</text>
  <text x="465" y="22" text-anchor="middle" font-size="12" font-weight="600" fill="#fb863a">AFTER — separated</text>
  <line x1="310" y1="36" x2="310" y2="280" stroke="#2d333d" stroke-width="1" stroke-dasharray="4 5"/>

  <!-- ===== BEFORE: one box, mixed lines ===== -->
  <rect x="40" y="60" width="220" height="170" rx="7" fill="#14161a" stroke="#3a414c" stroke-width="1.4"/>
  <text x="150" y="82" text-anchor="middle" font-size="12.5" font-weight="700" fill="#e8e4dc">handleSignup()</text>
  <rect x="56" y="96" width="188" height="16" rx="3" fill="rgba(94,159,246,0.18)"/><text x="64" y="108" font-size="9.5" fill="#5e9ff6">validate email</text>
  <rect x="56" y="116" width="188" height="16" rx="3" fill="rgba(251,134,58,0.18)"/><text x="64" y="128" font-size="9.5" fill="#fb863a">pick free plan</text>
  <rect x="56" y="136" width="188" height="16" rx="3" fill="rgba(92,198,111,0.18)"/><text x="64" y="148" font-size="9.5" fill="#5cc66f">INSERT user</text>
  <rect x="56" y="156" width="188" height="16" rx="3" fill="rgba(94,159,246,0.18)"/><text x="64" y="168" font-size="9.5" fill="#5e9ff6">check password</text>
  <rect x="56" y="176" width="188" height="16" rx="3" fill="rgba(167,139,250,0.18)"/><text x="64" y="188" font-size="9.5" fill="#a78bfa">render HTML</text>
  <rect x="56" y="196" width="188" height="16" rx="3" fill="rgba(92,198,111,0.18)"/><text x="64" y="208" font-size="9.5" fill="#5cc66f">SELECT user</text>
  <text x="150" y="246" text-anchor="middle" font-size="10" fill="#6b7280">4 concerns, one function</text>

  <!-- ===== AFTER: stacked single-concern layers ===== -->
  <rect x="375" y="50" width="180" height="40" rx="6" fill="#14161a" stroke="rgba(167,139,250,0.55)" stroke-width="1.4"/>
  <rect x="375" y="50" width="180" height="40" rx="6" fill="rgba(167,139,250,0.12)"/>
  <text x="465" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="#e8e4dc">Presentation</text>
  <text x="465" y="82" text-anchor="middle" font-size="9" fill="#a78bfa">render output · 1 concern</text>
  <line x1="465" y1="90" x2="465" y2="108" stroke="#9099a8" stroke-width="1.5" marker-end="url(#soc-down)"/>

  <rect x="375" y="114" width="180" height="40" rx="6" fill="#14161a" stroke="rgba(251,134,58,0.55)" stroke-width="1.4"/>
  <rect x="375" y="114" width="180" height="40" rx="6" fill="rgba(251,134,58,0.12)"/>
  <text x="465" y="132" text-anchor="middle" font-size="11.5" font-weight="700" fill="#e8e4dc">Business Logic</text>
  <text x="465" y="146" text-anchor="middle" font-size="9" fill="#fb863a">the rules · 1 concern</text>
  <line x1="465" y1="154" x2="465" y2="172" stroke="#9099a8" stroke-width="1.5" marker-end="url(#soc-down)"/>

  <rect x="375" y="178" width="180" height="40" rx="6" fill="#14161a" stroke="rgba(92,198,111,0.55)" stroke-width="1.4"/>
  <rect x="375" y="178" width="180" height="40" rx="6" fill="rgba(92,198,111,0.12)"/>
  <text x="465" y="196" text-anchor="middle" font-size="11.5" font-weight="700" fill="#e8e4dc">Data Access</text>
  <text x="465" y="210" text-anchor="middle" font-size="9" fill="#5cc66f">talk to storage · 1 concern</text>

  <text x="465" y="246" text-anchor="middle" font-size="10" fill="#6b7280">each layer changes alone</text>
</svg>`,
        caption:
          "**Before**, one `handleSignup()` holds four interleaved concerns — *validation* (blue), *business* (orange), *data* (green), *presentation* (violet) — so a change to any one risks the rest. **After**, the same work is split into stacked single-concern layers, each only talking to the one below. Swap the storage and only **Data Access** changes; the layers above it never notice.",
      },
      { type: "h", text: "Why this is the whole point" },
      {
        type: "ul",
        items: [
          "**Change safely** — touch one concern, leave the rest alone. Swapping the database can't break your validation if they live in different modules.",
          "**Test in isolation** — unit-test the business rules with a fake repository: no database, no network, fast and deterministic.",
          "**Reuse** — a sealed-off validator or presenter can be reused by other endpoints instead of being copy-pasted out of a giant function.",
          "**Understand faster** — to fix an HTML bug you open the presentation module, not a 200-line function where everything is mixed together.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Separation has a cost — don't over-split",
        text: "Splitting creates more files, more indirection, and more wiring to follow. For a *tiny* throwaway script or a one-off function, four layers is ceremony with no payoff — it just makes a 10-line job feel like a 5-file project. Separate the concerns that actually change for *different reasons* and at *different times*. If two 'concerns' always change together, they might really be one. Aim for *low coupling, high cohesion*, not the maximum number of files.",
      },
    ],

    handsOn: [
      {
        title: "01 · See the tangle",
        body: "Open the prototype. The `handleSignup()` box is a list of mixed lines, each tinted by its concern — *validation* (blue), *business logic* (orange), *data access* (green), *presentation* (violet) — and they are visibly interleaved. Read the live counter: *concerns crammed in: 4*. This one function cares about four different things at once. That is the smell.",
      },
      {
        title: "02 · Separate the concerns",
        body: "Press **Separate concerns** and watch the lines sort themselves into four clean stacked lanes — *Validation → Business Logic → Data Access → Presentation*. Each lane is now its own single-concern module, and each readout flips to *concerns: 1*. Nothing was deleted; the same work is just *sorted* so each part has one job.",
      },
      {
        title: "03 · Change one thing, see what it touches",
        body: "Click any lane to ask 'what does changing this concern affect now?'. Click **Data Access** and the one explain panel says: *swap the DB → only the Data Access layer changes; the other three are untouched*. Click **Presentation** and see that adding a JSON response touches only that lane. That isolation — change one concern without disturbing the rest — is the entire payoff of separating them.",
      },
    ],

    codeSamples: [
      {
        label: "TypeScript",
        language: "typescript",
        filename: "signup.ts",
        code: `// BEFORE — one function tangles all four concerns together.
function handleSignupV0(req: { email: string; password: string }) {
  if (!req.email.includes("@")) throw new Error("bad email");      // validation
  if (req.password.length < 8) throw new Error("weak password");   // validation
  db.run("INSERT INTO users(email, plan) VALUES(?, ?)",            // data access
         [req.email, "free"]);
  return \`<h1>Welcome, \${req.email}!</h1>\`;                         // presentation
}

// AFTER — one concern per module; the handler just coordinates.
function validateSignup(req: { email: string; password: string }) {  // validation
  if (!req.email.includes("@")) throw new Error("bad email");
  if (req.password.length < 8) throw new Error("weak password");
}
const users = {                                                      // data access
  create(email: string, plan: string) {
    db.run("INSERT INTO users(email, plan) VALUES(?, ?)", [email, plan]);
    return { email, plan };
  },
};
function signup(email: string) {                                     // business logic
  return users.create(email, "free");
}
function welcomeHtml(user: { email: string }) {                      // presentation
  return \`<h1>Welcome, \${user.email}!</h1>\`;
}
function handleSignup(req: { email: string; password: string }) {   // coordinator
  validateSignup(req);
  return welcomeHtml(signup(req.email));
}`,
      },
      {
        label: "Java",
        language: "java",
        filename: "Signup.java",
        code: `// BEFORE — one method tangles all four concerns together.
class SignupV0 {
    String handle(String email, String password) {
        if (!email.contains("@")) throw new IllegalArgumentException("bad email");  // validation
        if (password.length() < 8) throw new IllegalArgumentException("weak");      // validation
        db.run("INSERT INTO users(email, plan) VALUES(?, ?)", email, "free");       // data access
        return "<h1>Welcome, " + email + "!</h1>";                                  // presentation
    }
}

// AFTER — one concern per class; the handler just coordinates.
class SignupValidator {                                  // validation
    void check(String email, String password) {
        if (!email.contains("@")) throw new IllegalArgumentException("bad email");
        if (password.length() < 8) throw new IllegalArgumentException("weak");
    }
}
class UsersRepo {                                         // data access
    User create(String email, String plan) {
        db.run("INSERT INTO users(email, plan) VALUES(?, ?)", email, plan);
        return new User(email, plan);
    }
}
class SignupService {                                     // business logic
    private final UsersRepo users;
    SignupService(UsersRepo users) { this.users = users; }
    User signup(String email) { return users.create(email, "free"); }
}
class Presenter {                                         // presentation
    String welcomeHtml(User u) { return "<h1>Welcome, " + u.email + "!</h1>"; }
}
class SignupHandler {                                     // coordinator
    String handle(String email, String password,
                  SignupValidator v, SignupService s, Presenter p) {
        v.check(email, password);
        return p.welcomeHtml(s.signup(email));
    }
}`,
      },
      {
        label: "Python",
        language: "python",
        filename: "signup.py",
        code: `# BEFORE — one function tangles all four concerns together.
def handle_signup_v0(email: str, password: str) -> str:
    if "@" not in email:    raise ValueError("bad email")          # validation
    if len(password) < 8:   raise ValueError("weak password")      # validation
    db.run("INSERT INTO users(email, plan) VALUES(?, ?)",          # data access
           (email, "free"))
    return f"<h1>Welcome, {email}!</h1>"                           # presentation


# AFTER — one concern per function/object; the handler coordinates.
def validate_signup(email: str, password: str) -> None:           # validation
    if "@" not in email:  raise ValueError("bad email")
    if len(password) < 8: raise ValueError("weak password")

class UsersRepo:                                                   # data access
    def create(self, email: str, plan: str) -> dict:
        db.run("INSERT INTO users(email, plan) VALUES(?, ?)", (email, plan))
        return {"email": email, "plan": plan}

def signup(users: UsersRepo, email: str) -> dict:                 # business logic
    return users.create(email, "free")

def welcome_html(user: dict) -> str:                              # presentation
    return f"<h1>Welcome, {user['email']}!</h1>"

def handle_signup(email: str, password: str, users: UsersRepo) -> str:  # coordinator
    validate_signup(email, password)
    return welcome_html(signup(users, email))`,
      },
      {
        label: "C++",
        language: "cpp",
        filename: "signup.cpp",
        code: `#include <string>
#include <stdexcept>

// BEFORE — one function tangles all four concerns together.
std::string handleSignupV0(const std::string& email, const std::string& pw) {
    if (email.find('@') == std::string::npos) throw std::invalid_argument("bad email"); // validation
    if (pw.size() < 8) throw std::invalid_argument("weak password");                    // validation
    db.run("INSERT INTO users(email, plan) VALUES(?, ?)", email, "free");               // data access
    return "<h1>Welcome, " + email + "!</h1>";                                          // presentation
}

// AFTER — one concern per piece; the handler just coordinates.
struct User { std::string email, plan; };

void validateSignup(const std::string& email, const std::string& pw) {   // validation
    if (email.find('@') == std::string::npos) throw std::invalid_argument("bad email");
    if (pw.size() < 8) throw std::invalid_argument("weak password");
}
struct UsersRepo {                                                        // data access
    User create(const std::string& email, const std::string& plan) {
        db.run("INSERT INTO users(email, plan) VALUES(?, ?)", email, plan);
        return User{email, plan};
    }
};
User signup(UsersRepo& users, const std::string& email) {                // business logic
    return users.create(email, "free");
}
std::string welcomeHtml(const User& u) {                                 // presentation
    return "<h1>Welcome, " + u.email + "!</h1>";
}
std::string handleSignup(const std::string& email, const std::string& pw,
                         UsersRepo& users) {                             // coordinator
    validateSignup(email, pw);
    return welcomeHtml(signup(users, email));
}`,
      },
    ],

    whenToUse: [
      { type: "h", text: "Separate the concerns that change for different reasons" },
      {
        type: "p",
        text: "Separation pays off when a chunk of code mixes jobs that *evolve independently* — different reasons to change, different people, different speeds. Those seams are where bugs leak across and where tests get hard.",
      },
      {
        type: "ul",
        items: [
          "**Request handlers / controllers** — split validation, business rules, storage, and response formatting instead of one fat handler.",
          "**Anything touching the database** — keep SQL behind a data-access layer so the rules above it never see a query string.",
          "**UI apps** — keep data, display, and control apart (this is exactly what **MVC** and its cousins do).",
          "**Code you want to unit-test** — if you can't test the rules without standing up real infrastructure, the rules and the infrastructure want separating.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't separate things that always change together",
        text: "Separation is a tool, not a quota. For a small script, a quick prototype, or two 'concerns' that *always* move at the same time, splitting just adds files and indirection for no benefit. The signal to separate is *different reasons to change*. If validation and presentation truly never change apart, leaving them together is fine — high cohesion beats artificial splits.",
      },
    ],

    tradeoffs: {
      pros: [
        "Change safely — touch one concern without disturbing the others, because each lives in its own part.",
        "Testable in isolation — swap a fake data layer and unit-test the business rules with no database or network.",
        "Reusable — a sealed-off validator, repo, or presenter can serve many callers instead of being copy-pasted.",
        "Easier to understand — to fix one kind of bug you open one focused module, not a giant do-everything function.",
        "Parallel work — once the seams are clear, different people can build the layers at the same time.",
      ],
      cons: [
        "More files and indirection — one function becomes several modules, which is more to open and navigate.",
        "Wiring overhead — something must coordinate the parts and pass data between them.",
        "Over-splitting — pushed too far it turns simple code into layer soup, with empty pass-through modules.",
        "Wrong cuts hurt — separating along the wrong seam (concerns that always change together) adds ceremony with no payoff.",
      ],
    },

    furtherReading: [
      {
        label: "Separation of concerns — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Separation_of_concerns",
        note: "Crisp definition of the principle, its history, and how it connects to modularity, layering, and information hiding. The best one-page overview to anchor the idea.",
        kind: "docs",
      },
      {
        label: "On the role of scientific thought — Edsger W. Dijkstra (EWD447)",
        href: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD447.html",
        note: "The 1974 essay where Dijkstra coined 'separation of concerns', arguing you study one aspect at a time while staying aware it's only one aspect. The original source, and short.",
        kind: "paper",
      },
      {
        label: "Presentation Domain Data Layering — Martin Fowler",
        href: "https://martinfowler.com/bliki/PresentationDomainDataLayering.html",
        note: "Fowler's walk through the classic three-layer split (presentation / domain / data) — what each layer is for, why the dependencies point one way, and when to bother.",
        kind: "article",
      },
      {
        label: "MVC — MDN Web Docs glossary",
        href: "https://developer.mozilla.org/en-US/docs/Glossary/MVC",
        note: "A concrete, beginner-friendly example of separation of concerns: Model (data), View (display), Controller (control) kept apart in a UI app.",
        kind: "docs",
      },
      {
        label: "The Clean Architecture — Robert C. Martin",
        href: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
        note: "Separation of concerns scaled up to a whole system: concentric layers with rules in the center and details (DB, UI, frameworks) pushed to the edges so they can be swapped.",
        kind: "article",
      },
      {
        label: "Single Responsibility Principle — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Single-responsibility_principle",
        note: "SoC applied at the class level — 'a class should have one reason to change'. Good for seeing how the umbrella idea narrows into a specific, testable rule.",
        kind: "docs",
      },
    ],

    quiz: [
      {
        id: "separation-of-concerns-q1",
        question: "What is a 'concern' in separation of concerns?",
        options: [
          { id: "a", label: "A distinct aspect of the work — one reason the code might change (e.g. validation, business rules, data access, presentation)." },
          { id: "b", label: "A worry that the code might be too slow." },
          { id: "c", label: "Any function that is longer than ten lines." },
          { id: "d", label: "A bug that needs to be fixed before release." },
        ],
        correctOptionId: "a",
        explanation:
          "A concern is a distinct job or aspect — one reason the code has to care, and one reason it might change. Validation, business logic, data access, and presentation are four common concerns. The other options describe performance, length, or bugs, which aren't what 'concern' means here.",
      },
      {
        id: "separation-of-concerns-q2",
        question:
          "A single `handleSignup()` function validates input, applies business rules, runs SQL, and builds the HTML response. Why is mixing these a problem?",
        options: [
          { id: "a", label: "Changing one concern (like swapping the database) risks breaking the others, and you can't test or reuse any of them in isolation." },
          { id: "b", label: "The function will always be too slow to run in production." },
          { id: "c", label: "Functions are not allowed to call the database in any language." },
          { id: "d", label: "It's actually ideal — keeping everything in one place is the goal." },
        ],
        correctOptionId: "a",
        explanation:
          "When concerns are tangled in one function, they're welded together: changing the storage means editing the same code that holds your validation and HTML, you can't unit-test the rules without a real database, and nothing is reusable. Separating them removes all three pains.",
      },
      {
        id: "separation-of-concerns-q3",
        question:
          "After splitting signup into Validation, Business Logic, Data Access, and Presentation layers, you switch from MySQL to Postgres. What should you have to change?",
        options: [
          { id: "a", label: "Only the Data Access layer — the other three concerns are untouched." },
          { id: "b", label: "All four layers, since they all depend on the database." },
          { id: "c", label: "The Presentation layer, because it shows the data." },
          { id: "d", label: "Nothing — the database is not a concern at all." },
        ],
        correctOptionId: "a",
        explanation:
          "That isolation is the whole payoff. With storage sealed behind the Data Access layer, swapping the database touches only that layer; validation, business rules, and presentation never see a query string and don't change. If you had to edit all four, the concerns weren't actually separated.",
      },
      {
        id: "separation-of-concerns-q4",
        question: "How do the Single Responsibility Principle, MVC, and clean architecture relate to separation of concerns?",
        options: [
          { id: "a", label: "They're all specific applications of separation of concerns at different scales — class, UI app, and whole system." },
          { id: "b", label: "They contradict separation of concerns and replace it." },
          { id: "c", label: "They are unrelated ideas that just happen to share words." },
          { id: "d", label: "They only apply to functional programming, not object-oriented code." },
        ],
        correctOptionId: "a",
        explanation:
          "Separation of concerns is the umbrella idea. SRP is it at the class level ('one reason to change'), MVC is it for UI apps (model/view/controller kept apart), and clean/layered architecture is it across a whole system. Learn the umbrella and these become special cases of the same principle.",
      },
      {
        id: "separation-of-concerns-q5",
        question: "When is it a mistake to split code into separate concerns?",
        options: [
          { id: "a", label: "For a tiny script or two parts that always change together — the extra files and indirection add cost with no benefit." },
          { id: "b", label: "Whenever the code talks to a database, since data access should always stay inline." },
          { id: "c", label: "Any time the program has more than one user." },
          { id: "d", label: "It's never a mistake — more layers are always better." },
        ],
        correctOptionId: "a",
        explanation:
          "Separation has a real cost: more files, more indirection, more wiring. For a small throwaway script, or for two 'concerns' that always change at the same time, splitting is just ceremony. The signal to separate is *different reasons to change*. Aim for high cohesion and low coupling, not the maximum number of files.",
      },
    ],
  },
};
