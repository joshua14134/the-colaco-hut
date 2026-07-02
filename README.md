# The Colaco Hut - Coastal Fine Dining & Staff Console

An elegant, production-ready full-stack web application designed for **The Colaco Hut**, a luxury beachfront restaurant located on the shores of Vagator, Goa. This platform features a high-fidelity visual interface for guests to browse culinary menus, historical chronicles, and secure VIP table seating, paired with a secure administrative dashboard for staff operations.

The application has been successfully migrated from a local JSON-based file database to a highly scalable, production-ready **MySQL database** utilizing **Prisma ORM**.

---

## 🏛️ Architectural Overview

The application is engineered as a modern, full-stack application binding a highly performant **Vite-powered React Single-Page Application (SPA)** on the frontend to a robust **Express API backend** in a single integrated Node.js container.

```
                    ┌────────────────────────┐
                    │      React Frontend    │
                    │   (Vite + Tailwind CSS)│
                    └───────────┬────────────┘
                                │ (HTTPS / JSON API)
                                ▼
                    ┌────────────────────────┐
                    │     Express Backend    │
                    │   (NodeJS + tsx/ESM)   │
                    └───────────┬────────────┘
                                │ (Prisma Client)
                                ▼
                    ┌────────────────────────┐
                    │     MySQL Database     │
                    │  (Cloud SQL / Local)   │
                    └────────────────────────┘
```

---

## ✨ Features

### 🌊 Guest Experience (Frontend)
- **Culinary Menu Board**: Dynamic, categorized catalog featuring Goan specialties, Portuguese classics, fresh ocean seafood, and cellared reserves.
- **VIP Beachfront Reservations**: Real-time table request manager capturing guest metadata (guests count, seating preference, special requests, date, time).
- **Hospitality Careers Portal**: Live job openings matching culinary, beverage, and guest relation departments with secure portfolio/resume applications.
- **Chronicles & Heritage**: Immersive, elegant blog layout sharing ancestral Goan culinary practices, slow fermentation, and sommelier vintage pairings.
- **Aesthetic Visual Gallery**: Categorized high-fidelity photography carousel showcasing the beachfront venue atmosphere, exquisite cuisine, and stargazing celebratory lounge.

### 🔒 Staff Console (Administrative Portal)
- **Role-Based Authentication**: Secure JWT-based credential desk restricting access to `Admin`, `Manager`, and `Staff` positions.
- **Operational Dashboard (Stats)**: Interactive statistics pane showcasing unread inquiries, active reservations, total menu assets, and newsletter subscribers.
- **Interactive Reservation Triage**: Live control board for table allocation—allowing staff to confirm, cancel, seat, or mark bookings complete.
- **Dynamic Culinary Catalog Manager**: Graphical interface for authorized managers to instantly publish new recipes, edit active listings (including spiciness levels and special recommended flags), or purge out-of-season items.
- **Direct Guest Inbox**: Unified messaging panel supporting digital replies to inquiries, automatically updating message dispatch states.
- **Manager Ledger Management (Admin-Only)**: Centralized workspace for Owner/Admins to monitor, create, modify, suspend, or permanently revoke Manager credentials, control sector/department allocation, and perform security password resets.
- **Interactive Manager Dashboard & Analytics**:
  - **Six Real-Time Metrics**: Total Registry Count, Active Statuses, Inactive/On-Hold accounts, Suspended profiles, Live Online Sessions, and total Shift Check-ins today.
  - **Dynamic Sector Distribution**: Real-time visual progress bars tracking staff allocation across departments (Management, Culinary, Service, Beverage, VIP Guest Relations).
  - **Shift Login Volume**: Clean, interactive bar chart depicting login volume monthly.
- **Detailed Manager Profile Drawer**: Slide-out panel providing granular access to:
  - **Personal Specs**: Email, phone, assigned sector, total access count, and registration date.
  - **Administrative Notes**: Dedicated field for custom high-security clearance notes or operational constraints.
  - **Console Activity Chronology**: Real-time audit timeline showing exact operations performed (e.g., reservation updates, recipe creations).
  - **Login Chronology**: Accurate audit of login timestamps, client IP addresses, and user-agent string metadata.
- **Security Audit Trails**: Real-time security event log monitoring that records all manager management actions (creation, deletion, credential edits, and password resets) with caller details and remote IP address mappings.

---

## 🛠️ Database Schema (`prisma/schema.prisma`)

The database is built upon normalized relational schemas supporting complete constraints, indexes, cascade deletions, and native JSON storage where applicable:

- **Admin**: Unique email indexing, encrypted credentials hashes, role tracking (`Admin`, `Manager`, `Staff`), contact information (`phone`, `username`), department sector classification (`Management`, `Culinary`, `Service`, `Beverage`, `Guest Relations`), account status (`Active`, `Inactive`), and profile image assets.
- **ManagerLog**: Tamper-evident security audit logs capturing actor details, descriptors of the event (creation, modification, deletion, password reset), timestamps, and originating remote IP address mappings.
- **Reservation**: Primary key codes (`CH-REV-XXX`), seating parameters, timestamps, and request logs.
- **MenuItem**: Precise decimal prices, categorization, and culinary tags (chef recommendation, best seller, seasonal special).
- **GalleryItem**: Image asset routing, descriptions, and category organization.
- **BlogPost**: Rich text content, excerpts, estimated read times, and categories.
- **Subscriber**: Distinct, validated newsletter enrollment records.
- **ContactMessage**: Customer outreach records with automated status updates (`Unread`, `Read`, `Replied`) and official reply logs.
- **JobPosition & JobApplication**: 1-to-Many relationship binding job applications directly to position parameters with cascade deletion support.
- **EventItem**: Starlit beach lounge schedules, pricing, and visual representations.
- **Testimonial**: Validated guest reviews with rating scores and editorial publication sources.

---

## 🚀 Step-by-Step Getting Started Guide

Follow these highly detailed instructions to install, configure, migrate, seed, and run the system locally or in development mode.

### Step 1: Install Dependencies
Ensure you have **Node.js (v18 or higher)** and **npm** installed. Run the following command in the project root directory to download and install all necessary frontend, backend, and database dependencies (including TypeScript, Express, Vite, Prisma, and security libraries):

```bash
npm install
```

### Step 2: Configure Environment Variables
You must establish connection strings and security key signatures before booting the server. Create a file named `.env` in the root directory (matching the configuration in `.env.example`):

```bash
touch .env
```

Open the newly created `.env` file and define the following variables:

```env
# The port on which the combined frontend/backend server will run
PORT=3000

# High-security token signature key for backend admin/staff login sessions.
# Replace this with a secure random string of characters in production.
JWT_SECRET="the_colaco_hut_luxury_secret_key_2026"

# Prisma Connection URL for your active MySQL or Cloud SQL Database Instance.
# Syntax: mysql://<db_user>:<db_password>@<db_host>:<db_port>/<database_name>
# Example:
DATABASE_URL="mysql://root:secure_password_123@127.0.0.1:3306/colacohut"
```

### Step 3: Run Database Migrations
With your MySQL instance active and your `DATABASE_URL` configured in your `.env` file, push your Prisma relational schema directly to your database. This commands creates all necessary tables, constraints, foreign keys, and indexes automatically:

```bash
npx prisma db push
```

*Alternative for production tracking:* If you prefer database migration tracking files inside your repository:
```bash
npx prisma migrate dev --name init
```

### Step 4: Generate the Prisma Client
Always compile your Prisma client to ensure deep type-safety throughout the service layer:
```bash
npx prisma generate
```

### Step 5: Seed Curated Production Data
Populate your database with the curated fine-dining menus, professional beachfront photography assets, historical chronicles, upcoming starlit beach events, and default staff administrative profiles. Run the built-in seed runner:

```bash
npm run seed
```

Once executed successfully, you can log in to the administrative panel (`/admin` path on the browser) using either of the following pre-configured credentials:
- **Owner / Administrator Account**:
  - **Email**: `admin@colacohut.com`
  - **Password**: `ColacoHutAdmin2026!`
- **General Manager Account**:
  - **Email**: `clara@colacohut.com`
  - **Password**: `ClaraManager2026!`

### Step 6: Boot the Development Server
Launch the unified server. In development mode, Vite compiles frontend React assets on-the-fly and passes API calls straight to the Express routing layer:

```bash
npm run dev
```

Open your browser and navigate to the local server address:
👉 **`http://localhost:3000`**

---

## 🏗️ Production Deployment & Compilation Guide

To package the application for high-availability containers (such as Google Cloud Run, AWS App Runner, or Docker deployments), execute the production pipeline:

### 1. Build Compilation Phase
Compiles the React application into optimized, static, and highly minimized HTML/CSS/JS chunks inside the `/dist` directory, then bundles the custom Express TypeScript server into a single self-contained CommonJS file (`dist/server.cjs`) using Esbuild:

```bash
npm run build
```

This compilation step ensures:
- All relative ESM paths are pre-resolved, bypassing Node's strict runtime ES Module imports.
- Generates high-fidelity sourcemaps (`dist/server.cjs.map`) for runtime stack-trace debugging.
- Maximizes container warm-up speeds by decreasing direct filesystem I/O operations.

### 2. Launch Server
In your production container environment, ensure your secrets (`DATABASE_URL`, `JWT_SECRET`) are securely injected, and boot the server directly:

```bash
npm start
```

Your container will securely serve the client interface and API routes over port `3000` under high performance.
