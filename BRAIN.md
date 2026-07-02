# The Colaco Hut - BRAIN.md (System Source of Truth)

This document is the absolute, definitive technical reference for **The Colaco Hut** full-stack ecosystem. It details the complete architecture, data models, state flows, operational runtimes, API pathways, safety bounds, and deployment procedures. It is designed to allow any developer or AI Agent to instantly debug, extend, refactor, and maintain the codebase.

---

## 🗺️ High-Level Architecture & Execution Topology

The Colaco Hut is built as a unified, high-performance, full-stack application. It leverages a modern React SPA on the frontend and a robust Express REST API backend running within a single container.

```
+------------------------------------------------------------------------+
|                            USER BROWSER                                |
|                                                                        |
|  +------------------------+      +----------------------------------+  |
|  |  Vite + React SPA      |      |  Tailwind CSS UI                 |  |
|  |  (Lucide / Motion)     |      |  (Framer Motion Transitions)     |  |
|  +-----------+------------+      +----------------+-----------------+  |
+--------------|------------------------------------|--------------------+
               | (HTTPS Requests / JSON payloads)   | (Renders)
               ▼                                    ▼
+------------------------------------------------------------------------+
|                           EXPRESS BACKEND                              |
|                                                                        |
|  +------------------------+      +----------------------------------+  |
|  |  Express REST Router   |      |  JWT Auth & Role validation      |  |
|  |  (zod schema validation)|     |  (Admin, Manager, Staff levels)  |  |
|  +-----------+------------+      +----------------+-----------------+  |
|              |                                    |                    |
|              +-----------------+------------------+                    |
|                                | (Prisma Client Calls)                 |
|                                ▼                                       |
|                  +---------------------------+                         |
|                  |  Prisma Client ORM        |                         |
|                  +-------------+-------------+                         |
+--------------------------------|---------------------------------------+
                                 ▼ (MySQL Connection Protocol)
+------------------------------------------------------------------------+
|                          DATABASE STORAGE                              |
|                                                                        |
|                      +-------------------+                             |
|                      |   MySQL Database  |                             |
|                      | (Cloud SQL/Local) |                             |
|                      +-------------------+                             |
+------------------------------------------------------------------------+
```

### Why This Design Exists
1. **Express + Vite Integration**: In development, Express runs the Vite development server in middleware mode (`vite.middlewares`), allowing real-time asset compilation and routing directly over a single local port (`3000`).
2. **Atomic Container Deployments**: In production, Vite compiles all React assets statically to `/dist`. The Express backend serves these static files via `express.static` and routes all remaining HTTP paths to `/dist/index.html` for client-side routing.
3. **Prisma ORM over MySQL**: The migration from `db.json` to Prisma ORM delivers strong types, proper transactional controls, automated timestamp updating, database-level indices, cascade deletions, and native relational schemas.

---

## 🗄️ Database Models & Relationships

The database is built on normalized relational tables optimized with indices and standard constraints.

```
       +-------------------------+
       |          Admin          |
       |-------------------------|
       | id: UUID                |
       | email: VARCHAR (U)      |
       | passwordHash            |
       | name: VARCHAR           |
       | role: VARCHAR           | (Admin, Manager, Staff)
       | phone: VARCHAR?         |
       | username: VARCHAR?      |
       | department: VARCHAR?    |
       | profileImage: VARCHAR?  |
       | status: VARCHAR         | (Active, Inactive)
       | createdAt: DATETIME     |
       | updatedAt: DATETIME     |
       +-------------------------+

       +-------------------------+
       |       ManagerLog        |
       |-------------------------|
       | id: UUID (PK)           |
       | timestamp: DATETIME     |
       | userId: VARCHAR         | (Actor ID)
       | userName: VARCHAR?      |
       | action: VARCHAR         | ("Manager Created", etc.)
       | details: TEXT           |
       | ipAddress: VARCHAR?     |
       +-------------------------+

       +--------------------+
       |    Reservation     |
       |--------------------|
       | id: VARCHAR (PK)   | (CH-REV-XXX)
       | guests: VARCHAR    |
       | date: VARCHAR      |
       | time: VARCHAR      |
       | occasion: VARCHAR  |
       | seating: VARCHAR   |
       | name: VARCHAR      |
       | phone: VARCHAR     |
       | email: VARCHAR     |
       | specialRequests    |
       | status: VARCHAR    | (Pending, Confirmed, Cancelled, Seated, Completed)
       +--------------------+

       +--------------------+
       |      MenuItem      |
       |--------------------|
       | id: UUID           |
       | name: VARCHAR      |
       | category: VARCHAR  | (starters, seafood, goan, portuguese, desserts, cellar)
       | price: FLOAT       |
       | description: TEXT  |
       | recommended: BOOL  |
       | bestSeller: BOOL   |
       | seasonal: BOOL     |
       | spicyLevel: INT    | (0, 1, 2, 3)
       +--------------------+

+───────────────────────────────────+
│       Careers / Applications      │
│───────────────────────────────────│
│  +------------------------+       │
│  |      JobPosition       |       │
│  |------------------------|       │
│  | id: UUID               |       │
│  | title: VARCHAR         |       │
│  | department: VARCHAR    |       │
│  | requirements: JSON     |       │
│  +-----------+------------+       │
│              | 1                  │
│              |                    │
│              | 0..*               │
│  +-----------▼------------+       │
│  |     JobApplication     |       │
│  |------------------------|       │
│  | id: UUID               |       │
│  | jobId: UUID (FK)       |       │
│  | jobTitle: VARCHAR      |       │
│  | experience: TEXT       │       │
│  +------------------------+       │
+───────────────────────────────────+

       +--------------------+
       |   ContactMessage   |
       |--------------------|
       | id: UUID           |
       | name: VARCHAR      |
       | email: VARCHAR     |
       | subject: VARCHAR   |
       | message: TEXT      |
       | status: VARCHAR    | (Unread, Read, Replied)
       | replyText: TEXT    |
       +--------------------+

       +--------------------+
       |     Subscriber     |
       |--------------------|
       | id: UUID           |
       | email: VARCHAR (U) |
       | subscribedAt       |
       +--------------------+

       +--------------------+
       |    GalleryItem     |
       |--------------------|
       | id: UUID           |
       | title: VARCHAR     |
       | category: VARCHAR  | (atmosphere, cuisine, heritage, celebrations)
       | imageUrl: TEXT     |
       +--------------------+

       +--------------------+
       |    BlogPost        |
       |--------------------|
       | id: UUID           |
       | title: VARCHAR     |
       | excerpt: TEXT      |
       | content: TEXT      |
       | category: VARCHAR  |
       +--------------------+
```

---

## 🔄 Critical Business Workflows & State Flows

### 1. VIP Reservation Booking & Seating Pipeline
- **Public Entry Point**: Guest fills out reservation form on the React UI. A `POST /api/reservations` request is executed.
- **Backend Validation**: Zod schema parses fields, checking parameters like `seating` and guest details.
- **Record Creation**: Inside `src/services/dbService.ts`, a randomized 3-digit reservation tracking code is constructed, prefixed (e.g., `CH-REV-542`), and committed with status set to `Pending`.
- **Administrative Triage**: Admin/Manager views bookings. When seating a table or handling cancellation, they trigger `PUT /api/reservations/:id` sending an updated status.
- **State Progression**: `Pending` ➡️ `Confirmed` ➡️ `Seated` ➡️ `Completed` (or `Cancelled`).

### 2. Secure Staff Console Access Flow
- **Credentials Submission**: The React client routes the credentials to `POST /api/auth/login`.
- **Hashing Verification**: The service queries the `Admin` model by email. If found, `bcrypt.compare` checks the raw password against the database hash.
- **JWT Signature**: If verified, a JWT signed with `JWT_SECRET` is generated. It encapsulates the user ID, email, role, and name, with an `8h` expiration window.
- **Client Handling**: The client writes this token to `localStorage` as `admin_token` and updates application context state.
- **Guard Enforcement**: All admin API endpoints are protected via `authenticateJWT` and optionally scoped with `requireRole(['Admin', 'Manager'])`.

### 3. Culinary Catalog updates
- **Auth Guard**: Requests must pass authentication. Addition, Modification, and Deletion require `Admin` or `Manager` scope.
- **Strict Data Typing**: Price and spicy levels are parsed and safely cast to standard Numeric types. `spicyLevel` is mapped strictly to the set `(0 | 1 | 2 | 3)`.
- **Live Feed updates**: React component fetches updated menus instantly after database alterations, bypassing standard browser-side state lag.

### 4. Staff & Manager Lifecycle Management (Admin-only Controls)
- **Role Isolation**: Only authenticated users with the `Admin` role can manage, create, view, edit, or delete `Manager` roles or accounts.
- **Creation & Profile Workflow**: Admins provide a password which is securely salted/hashed with `bcrypt` (12 rounds) and stored with `role: "Manager"`. Profiles support selection of pre-set professional portrait avatars (Sommelier, Chef, Guest Relations, Mixologist) or custom photo URLs, alongside custom Administrative briefing notes for roster, security clearance details, or constraints.
- **Credential Suspension & Modification**: Admins can change status (`Active`, `Inactive`, `Suspended`), reset passwords, or completely delete manager profiles. If an account is set to `Inactive` or `Suspended`, their access credentials are barred from logging in.
- **Statistical Analytics Engine**:
  - **Aggregated Real-Time Console States**: The backend aggregates real-time counts including:
    - *Total Registry Count*: Sum of all staff credentials in the database.
    - *Active Statuses*: Authorized personnel currently matching active states.
    - *Inactive/On-Hold*: Accounts with suspended shift status.
    - *Suspended Statuses*: Accounts permanently banned/access revoked.
    - *Online Now Sessions*: Dynamic tracking of currently active login sessions.
    - *Shift Check-ins Today*: Logins recorded since local midnight.
  - **Dynamic Sector Distribution**: Interactive bar graphs demonstrating exact percentages of staff assigned to specialized hospitality sectors (Management, Culinary, Service, Beverage, VIP Guest Relations).
  - **Monthly Shift Login Volume**: Interactive graphical representation showcasing historic activity metrics.
- **Granular Security Auditing Panels**:
  - **Detailed Profiles Drawer**: Uses a slide-out drawer pattern to reveal complete personal profiles, including administrative briefing comments.
  - **Integrated Operations Chronology Logs**: Live query on the `ManagerLog` database table for logs associated with the selected manager's ID, showing exact security actions (e.g., reservation triage, catalogue modifications).
  - **Chronological Login History Records**: Accurate audit listing of previous login timestamps, client IP address mappings, and detailed user-agent browser configurations.
- **Immutable Log Recording**: Any creation, modification, deletion, or security credential update triggers an asynchronous entry in the `ManagerLog` database table. This records the action, timestamp, the admin's ID/name, complete descriptions of the modification, and the caller's originating IP address.

---

## 🔒 Security Architecture

1. **Authentication Token Safety**:
   - Signature keys are validated against the environment secret (`JWT_SECRET`). If empty, it falls back to a hardcoded signature string ONLY in non-production runtimes.
   - Credentials are never logged or stored in plain-text; password storage utilizes double-salted `bcryptjs` hashing.
2. **Strict RBAC (Role-Based Access Control)**:
   - Route access is restricted based on specific user roles: `requireRole(['Admin'])` protects sensitive operations such as Staff & Manager management, while general operations utilize `requireRole(['Admin', 'Manager'])`.
   - Security audit trails of manager actions are permanently stored in the `ManagerLog` database ledger to protect console integrity.
3. **Express Middlewares**:
   - `X-Frame-Options: SAMEORIGIN` prevents Clickjacking attacks inside third-party iframe overlays.
   - `X-Content-Type-Options: nosniff` defends against content-type sniffing vulnerabilities.
   - `X-XSS-Protection` blocks scripting injection attacks on standard layout views.
3. **Missing DB Fallbacks**:
   - Every API is protected by a `dbCheck` middleware. If `DATABASE_URL` is omitted, the API responds with a helpful `503 Service Unavailable` explaining config requirements without completely crashing the container.

---

## 🛠️ Build, Development & Start scripts

The build pipeline compiles TypeScript code and bundles the express server cleanly for standalone execution:

- **Development Runtime**: Booted using `tsx` (TypeScript Execute) to compile Express and Prisma dependencies on-the-fly:
  ```bash
  npm run dev
  ```
- **Compilation Steps**:
  1. Compiles frontend React files into static assets utilizing Vite's asset compiler:
     ```bash
     vite build
     ```
  2. Compiles backend TypeScript files into a single, highly compressed CommonJS file located at `dist/server.cjs` utilizing the speed of the Esbuild compiler. This resolves any relative ESM import paths to support Node's standard CJS loader:
     ```bash
     esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
     ```
- **Container Launch**: Initiates node directly over the self-contained bundle, listening strictly on `port 3000` over all host IP configurations (`0.0.0.0`):
  ```bash
  node dist/server.cjs
  ```

---

## ⚠️ Known Assumptions, Risks & Troubleshooting

1. **Top-Level Await inside CommonJS**:
   - *Issue*: Historically, Node standard ES modules supported top-level awaits (`await initDatabase()`). During bundling into CommonJS formats (`CJS`), top-level awaits trigger bundle compilation failures.
   - *Resolution*: Always initialize the database asynchronously *inside* the main initialization block (e.g., inside `startServer()`) rather than module-level contexts.
2. **Environment Variable Injection**:
   - *Risk*: If database links (`DATABASE_URL`) contain insecure syntax, Prisma generation fails. Ensure strings conform to standard formats: `mysql://username:password@hostname:port/database_name`.
   - *Vite client exposure*: Secret keys (like `JWT_SECRET` and database connections) do **not** contain the `VITE_` prefix, preventing them from being exposed to browser consoles during client bundling.
