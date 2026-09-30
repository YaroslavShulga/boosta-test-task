# BrainsMate: ADHD Test Funnel

A funnel for an ADHD trait test. The user takes a short anonymous quiz (gender + 5 statements), creates an account (email + password) and sees a personal report. Returning users sign in to see their latest report.

- `backend/`: NestJS + TypeORM + PostgreSQL API
- `frontend/`: Next.js 16 (App Router) app, a separate application

## Run locally in production mode

The whole stack runs in Docker with production builds: the compiled NestJS backend, the standalone Next.js server and PostgreSQL 17.

### Prerequisites

- Docker with Docker Compose v2 (`docker compose version`)
- Free host ports **3001** (frontend) and **5432** (Postgres). You can change them in `.env`.

### 1. Configure

From the repository root:

```bash
cp .env.example .env
```

Edit `.env` and set the two required values:

| Variable      | Required | Default                 | Description                                                                          |
| ------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `DB_PASSWORD` | yes      | none                    | Postgres password                                                                    |
| `JWT_SECRET`  | yes      | none                    | Access token signing secret, at least 16 characters (e.g. `openssl rand -hex 32`)    |
| `DB_USERNAME` | no       | `postgres`              | Postgres user                                                                        |
| `DB_NAME`     | no       | `app`                   | Database name                                                                        |
| `DB_PORT`     | no       | `5432`                  | Host port of Postgres                                                                |
| `JWT_TTL`     | no       | `604800`                | Access token lifetime, seconds (7 days)                                              |
| `FRONTEND_PORT` | no     | `3001`                  | Host port of the app                                                                 |
| `APP_URL`     | no       | `http://localhost:3001` | Public URL of the frontend (backend CORS origin)                                     |
| `COOKIE_SECURE` | no     | `false`                 | Set to `true` when the app is served over HTTPS                                      |

If either required variable is missing, `docker compose` stops with an error that names it.

### 2. Build and start

```bash
docker compose up -d --build
```

This builds both images and starts the containers in this order:

1. `postgres_boosta_prod` starts and waits until it's ready.
2. `backend_boosta_prod` starts, applies the database migrations (schema + quiz definition) and waits for its health check.
3. `frontend_boosta_prod` starts and serves the app.

The first build takes a few minutes. Check the status with:

```bash
docker compose ps
```

All three services should be `running`, and the backend `healthy`.

### 3. Open the app

Go to **http://localhost:3001** (or your `FRONTEND_PORT`).

Suggested walkthrough:

1. **Get ready:** pick Male or Female.
2. **Questions 1–5:** answer each one
3. **Account creation:** enter an email and a password of at least 8 characters, then click "Get My Results".
4. **Report:** your score gauge, level (High/Low ADHD Traits) and the sections for your gender and level.
5. Click **Sign out**, then **Sign in** with the same credentials to see the report again.
6. Click **Retake test**: as a signed-in user you go straight to the updated report after the last question.


## Development

For hot-reload development, see `docker-compose.dev.yml`:

```bash
docker compose -f docker-compose.dev.yml up --build
```

It runs the backend on :3000 and the frontend on :3001

## Checking the code

Each app has a `verify` script that runs its code checks and a production build. Run it in both apps (Node.js 22 and `npm ci` first):

```bash
cd backend && npm ci && npm run verify
cd frontend && npm ci && npm run verify
```

- **backend:** formats the code with Prettier, lints it with oxlint (type-aware) and builds it with `nest build`.
- **frontend:** lints the code with ESLint and builds it with `next build` (includes the TypeScript type check).

If a command reports errors, the app isn't in a good state.

## Key architectural decisions

Backend split into feature modules with three layers. The backend has five modules: users, quizzes, attempts, auth and reports. Each module has the same three layers. The domain layer holds the business rules and knows nothing about the database or HTTP. The infrastructure layer talks to the database. The resources layer handles HTTP requests and responses. Business logic can then change without touching the database code, and new endpoints or a different storage can be added without rewriting the rules. Dependencies between modules go in one direction only (for example, reports use attempts and quizzes, never the other way round), so there are no circular dependencies.

The quiz is data in the database, and it is versioned. Questions, answer options and their weights are stored in tables, grouped under a quiz version. A published version is never edited. Any change to the quiz is released as a new version, and the old one is kept. Every attempt remembers which quiz version it was taken on. Every answer points to the exact question and option by id, not by position or text. An old result is therefore always read against the exact questions the user saw. Questions and options also have stable keys (like "lose-track-of-time") that stay the same across versions, so answers can be compared between versions.

Progress is saved on the server after every answer. Each answer is stored as soon as it is selected. A page refresh or a later return doesn't lose progress, and the user can go back and change an answer. Anonymous visitors are recognised by a random token in a secure cookie, and only a hash of that token is stored. When the visitor signs up or signs in, their anonymous attempts are moved to their account.

Attempts are never deleted. A retake creates a new attempt. The current result is simply the latest completed attempt, and all earlier attempts stay in the database. This keeps the full history available for future report sections.

Scoring is pluggable and its result is frozen. Each quiz version names the scoring rule it uses. The current rule turns the answers into a score from 0 to 100, where stronger agreement means a higher score. A score of 60 or more is "High", so the mockup examples come out as 74 High and 52 Low. When an attempt is completed, its score, level and a snapshot of the rule settings are saved with it. Later rule changes don't alter old results.

The report is assembled on the backend from sections. The quiz version names the report template to use. The template is an ordered list of section builders: score, understanding, strengths, emotional regulation and FAQ. Each builder receives the attempt, the quiz version it was taken on, the answers by question key and the user's previous attempts. The frontend has no report logic. It just displays the section types it receives (score, text, checklist, FAQ), in the order given.

Minimal but safe authentication. The task asked for minimal auth, so there's only email and password. Passwords are hashed with argon2. The session is a signed token in an httpOnly cookie that page scripts can't read. Sign-up and sign-in are rate limited. A duplicate email gets a clear message that suggests signing in.

Frontend structure. Pages contain only routing. The quiz, auth and report code live in their own feature folders, mirroring the backend modules. The report page is rendered on the server, so it shows up without a loading flash. Each quiz question has its own URL, so refresh and the browser back button behave as expected, and a user can't open a question they haven't reached yet.

Docker for both development and production. One compose file starts the whole stack with hot reload for development. A second one builds and runs optimised production images.

## How the solution handles future changes to the test and the report

Questions change. Adding, removing, rewording or reordering questions or options means publishing a new quiz version through a database migration. New attempts use the new version. Old attempts keep pointing to the version they were taken on, so their answers, score and report stay correct.

Scoring logic changes. A new rule is added as a new scoring strategy and referenced by a new quiz version. Old attempts keep the score and level they were given, together with the rule settings used.

Report logic changes. A report is a template made of section builders, so a new or changed section means adding or editing one builder. A builder can also decide not to show its section. The frontend displays sections by type, so a new section of an existing type needs no frontend change.

Sections that depend on specific answers. Every builder gets the answers grouped by the stable question key. A section can react to the answer to a particular question, and it keeps working across quiz versions that keep the same key.

Sections that use previous attempts. Every builder also gets the user's earlier completed attempts. Since attempts are never deleted, a section like "how your result changed since last time" can be added without changing the data model.

## Trade-offs

The session token can't be revoked on the server. Signing out removes the cookie, but a copied token stays valid until it expires (7 days by default). This keeps auth simple, as the task asked.

A few multi-step operations, such as starting a new attempt while abandoning the old one, don't run in a single database transaction. Database constraints still guarantee at most one unfinished attempt per user or visitor, so a race can't leave broken data.

Report texts live in the code, not in the database. Changing the wording needs a deploy, but the texts are type-checked and versioned together with the report template.

The report is built when it is opened, and only the score and level are stored. Text fixes therefore also show up in old reports (usually what we want), while scores stay fixed.

An unfinished attempt on an older quiz version can't be continued after a new version is published. The user starts over, and the old attempt stays stored as abandoned.

The frontend's quick route guard only checks that a login cookie exists. The backend does the real check, and an expired session sends the user back to sign in.

The backend address is fixed into the frontend when it is built, so changing it requires rebuilding the frontend image.

## What was not done and why

Automated tests were not written yet. The time went into the core flow and the data model, and tests are the next planned step. For now each app's verify script lints, type-checks and builds the code, and the flow was checked by hand.

There is no admin screen for editing quizzes. New quiz versions are released through database migrations, which keeps them reviewed and reproducible.

The design follows the mockups in structure and elements but is not pixel-perfect.
