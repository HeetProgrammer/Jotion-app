# Jotion

**[View Live Demo]([https://jotion-app-iota.vercel.app/])**

Jotion is a real-time collaborative workspace application built for a hackathon. It functionality mimics core Notion features, allowing users to create hierarchical documents, organize them into workspaces, and edit them simultaneously with team members.



## Key Features

* **Real-time Collaboration:** Multiplayer text editing with live cursors and presence (powered by Liveblocks & Yjs).
* **Hierarchical File System:** Infinite nesting of pages and folders.
* **Multi-Workspace Architecture:** Users can create different workspaces and switch contexts easily.
* **Role-Based Access:** Granular permissions for Owners, Editors, and Viewers.
* **Email Invitations:** Invite members to join your workspace via email (powered by Resend).
* **Secure Authentication:** Full session management and protection.

## Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL (via Neon)
* **ORM:** Prisma
* **Real-time:** Liveblocks
* **UI Components:** Shadcn UI + Tailwind CSS
* **Editor:** BlockNote

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/jotion.git](https://github.com/yourusername/jotion.git)
cd jotion
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env.local file in the root directory. You will need keys for the database, authentication, and real-time services.

Code snippet
```
# Database (Postgres connection string)
DATABASE_URL="postgres://..."

# Liveblocks (Real-time collaboration)
LIVEBLOCKS_SECRET_KEY="sk_prod_..."

# Authentication (Random string for securing sessions)
BETTER_AUTH_SECRET="your_generated_secret_here"
BETTER_AUTH_URL="http://localhost:3000"

# Resend (Email Invites)
RESEND_API_KEY="re_..."
```

### 4. Setup Database
Push the schema to your database instance.

```Bash

npx prisma db push
```

### 5. Run the application
Bash

```
npm run dev
```

The app should now be running at http://localhost:3000.

### How to Test Collaboration
To verify the real-time features locally:

Open http://localhost:3000 in your main browser and log in as User A.

Open a new Incognito/Private window and log in as User B.

As User A, invite User B's email to the workspace.

Open the same document in both windows.

Type in one window—the text will sync instantly to the other.
