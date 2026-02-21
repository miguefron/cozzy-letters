# CozyLetters

Send warm letters to random souls around the world. Write a letter, and it gets delivered to 5 random users — like a cozy, digital pen-pal experience.

## Tech Stack

| Layer          | Technology                                      |
|----------------|------------------------------------------------|
| Frontend       | Next.js 15 (App Router), Bun, Tailwind CSS 4, Zustand, Framer Motion |
| Backend        | Java 21, Spring Boot 3.5, Spring Security (JWT), JPA/Hibernate |
| Database       | PostgreSQL 16 (Docker)                          |

## Project Structure

```
cozzy-letters/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Home page
│       │   └── write-letter/
│       │       └── page.tsx          # Letter writing page with animations
│       ├── components/cozy/          # Reusable cozy UI components (WIP)
│       └── stores/
│           └── useLetterStore.ts     # Zustand store for letter state & API
├── backend/           # Spring Boot API
│   └── src/main/java/com/cozyletters/backend/
│       ├── config/          # Security & CORS configuration
│       ├── controller/      # REST endpoints (Auth, Letters)
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
| POST   | `/api/auth/dev-token` | Public   | Generate a JWT token (dev only)    |
| POST   | `/api/letters`        | Required | Send a letter to 5 random users    |

## Current Status

### Implemented

- Home page with cozy design system (cream, terracotta, moss, wood palette)
- Letter writing page with multi-phase Framer Motion animations (write → fold → fly → success)
- Zustand store for client-side state management and API communication
- Spring Boot REST API with JWT authentication (HS256, 24h expiration)
- Database schema: Users, Letters, and LetterRecipients with proper relationships
- Random recipient selection (5 users via native PostgreSQL query)
- CORS configuration for frontend-backend communication
- Dockerized PostgreSQL with health checks

### Pending

- User registration and login (OAuth2 dependency included but not wired)
- Inbox / mailbox page for reading received letters
- Mark letters as read functionality
- Reusable cozy UI component library (`src/components/cozy/`)
- Production environment configuration
