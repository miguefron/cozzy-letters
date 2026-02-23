# CozyLetters

Send warm letters to random souls around the world. Write a letter, and it gets delivered to 5 random users — like a cozy, digital pen-pal experience.

## Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| Frontend       | Next.js 15 (App Router), Bun, Tailwind CSS 4, Zustand, Framer Motion, Tiptap |
| Backend        | Java 21, Spring Boot 3.5, Spring Security (JWT + OAuth2), JPA/Hibernate |
| Database       | PostgreSQL 16 (Docker)                          |

## Project Structure

```
cozzy-letters/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── inbox/page.tsx        # Inbox — read received letters
│       │   ├── write-letter/page.tsx # Advanced rich text editor
│       │   ├── admin/page.tsx        # Admin panel (letters & users)
│       │   ├── login/page.tsx        # Login (email/password + Google OAuth2)
│       │   ├── register/page.tsx     # Registration
│       │   └── profile/page.tsx      # User profile
│       ├── components/cozy/          # Reusable cozy UI components
│       │   ├── CozyButton.tsx        # Button component (primary, secondary, ghost, danger)
│       │   ├── CozyInput.tsx         # Input/textarea component
│       │   ├── CozyCard.tsx          # Card component with animation support
│       │   ├── TiptapEditor.tsx      # Rich text editor (bold, italic, headings, lists, etc.)
│       │   ├── LetterContent.tsx     # Safe HTML renderer with DOMPurify
│       │   ├── FAB.tsx               # Floating action button for quick letters
│       │   ├── QuickLetterModal.tsx  # Quick letter popup modal
│       │   ├── LayoutShell.tsx       # Layout with navbar + FAB
│       │   ├── Navbar.tsx            # Responsive navbar with avatar dropdown
│       │   └── Skeleton.tsx          # Loading skeleton component
│       ├── stores/
│       │   ├── useAuthStore.ts       # Auth state (login, register, JWT)
│       │   ├── useLetterStore.ts     # Letter composing & sending
│       │   ├── useInboxStore.ts      # Inbox state & mark as read
│       │   └── useAdminStore.ts      # Admin panel state
│       └── lib/
│           └── api.ts                # Authenticated fetch wrapper
├── backend/           # Spring Boot API
│   └── src/main/java/com/cozyletters/backend/
│       ├── config/          # Security & CORS configuration
│       ├── controller/      # REST endpoints (Auth, Letters, Users)
│       ├── dto/             # Request/Response objects
│       ├── model/           # JPA entities (User, Letter, LetterRecipient)
│       ├── repository/      # Data access layer
│       ├── security/        # JWT service & authentication filter
│       └── service/         # Business logic
└── docker-compose.yml # PostgreSQL container
```

## Getting Started

### Prerequisites

- Docker
- Bun
- Java 21

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Start the frontend

```bash
cd frontend
bun install
bun dev
```

The app will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint              | Auth     | Description                        |
|--------|-----------------------|----------|------------------------------------|
| POST   | `/api/auth/register`  | Public   | Register a new user                |
| POST   | `/api/auth/login`     | Public   | Login with email/password          |
| GET    | `/api/auth/me`        | Required | Get current user info              |
| POST   | `/api/letters`        | Required | Send a letter to 5 random users    |
| GET    | `/api/letters/inbox`  | Required | Get received letters               |
| PATCH  | `/api/letters/:id/read` | Required | Mark a letter as read            |
| GET    | `/api/admin/letters`  | Admin    | List all letters                   |
| DELETE | `/api/admin/letters/:id` | Admin | Delete a letter                   |
| GET    | `/api/admin/users`    | Admin    | List all users                     |
| DELETE | `/api/admin/users/:id`| Admin    | Delete a user                      |

## Features

- **Cozy design system** — cream, terracotta, moss, and wood palette with serif headings, rounded corners, and soft shadows
- **Rich text editor** — Tiptap-powered editor with bold, italic, underline, headings, lists, alignment, blockquotes, links, and text color
- **Quick letter popup** — floating action button opens a modal for writing simple letters from any page
- **Letter animations** — multi-phase Framer Motion animations (write → fold → fly → success)
- **Inbox** — read received letters with HTML rendering and read/unread status
- **Admin panel** — manage all letters and users with search and filters
- **Authentication** — email/password login and Google OAuth2
- **JWT security** — stateless authentication between Next.js and Spring Boot
- **Responsive** — mobile-first design with adaptive navbar and layouts
