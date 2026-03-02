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
│       │   ├── Skeleton.tsx          # Loading skeleton component
│       │   └── PushNotificationToggle.tsx # Push notification toggle
│       ├── stores/
│       │   ├── useAuthStore.ts       # Auth state (login, register, JWT)
│       │   ├── useLetterStore.ts     # Letter composing & sending
│       │   ├── useInboxStore.ts      # Inbox state & mark as read
│       │   ├── useAdminStore.ts      # Admin panel state
│       │   └── usePushStore.ts      # Push notification state
│       └── lib/
│           ├── api.ts                # Authenticated fetch wrapper
│           └── pushNotifications.ts  # Web Push API utilities
├── backend/           # Spring Boot API
│   └── src/main/java/com/cozyletters/backend/
│       ├── config/          # Security & CORS configuration
│       ├── controller/      # REST endpoints (Auth, Letters, Users, PushController)
│       ├── dto/             # Request/Response objects
│       ├── model/           # JPA entities (User, Letter, LetterRecipient, PushSubscription)
│       ├── repository/      # Data access layer (incl. PushSubscriptionRepository)
│       ├── security/        # JWT service & authentication filter
│       └── service/         # Business logic (incl. WebPushService)
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

## Production Deployment

### Prerequisites

- A Linux server with Docker and Nginx installed
- A domain or subdomain pointing to the server IP
- Google OAuth2 credentials (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### 1. Clone and configure

```bash
git clone https://github.com/miguefron/cozzy-letters.git /var/cozyletters
cd /var/cozyletters
cp .env.production.example .env.production
```

Edit `.env.production` with your real values (database password, JWT secret, Google OAuth credentials, domain URLs).

### 2. Create the database schema (first time only)

The prod profile uses `ddl-auto: validate`, so tables must exist before starting. Run the backend once with `update` to create them:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d postgres
# Wait for postgres to be healthy, then:
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update backend
```

Stop it once it starts successfully (Ctrl+C), then proceed normally.

### 3. Build and start all services

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

### 4. Configure Nginx

```bash
cp nginx/cozyletters.conf /etc/nginx/sites-enabled/cozyletters.conf
nginx -t && systemctl reload nginx
```

The app will be available at `http://yourdomain:8080`.

### 5. Subsequent deploys

A deploy script is available at `/home/deploy-cozyletters.sh`:

```bash
bash /home/deploy-cozyletters.sh
```

This pulls the latest code, rebuilds the containers, and reloads Nginx.

### Google OAuth2 setup

In the Google Cloud Console, add:
- **Authorized JavaScript origins**: `http://yourdomain:8080`
- **Authorized redirect URIs**: `http://yourdomain:8080/login/oauth2/code/google`

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
| POST   | `/api/push/subscribe`  | Required | Subscribe to push notifications     |
| DELETE | `/api/push/subscribe`  | Required | Unsubscribe from push notifications |

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
- **PWA** — installable as native app on mobile and desktop with standalone display
- **Push notifications** — real-time notifications for new letters, even with the app closed

## PWA & Push Notifications

### Installable App (PWA)

CozyLetters is a Progressive Web App — users can install it from the browser and use it like a native app:

- **Web App Manifest** (`frontend/src/app/manifest.ts`) — `display: "standalone"`, theme/background colors, icons (192x192 maskable + 512x512)
- **Layout metadata** (`layout.tsx`) — viewport `themeColor`, `appleWebApp` for iOS Safari support
- **Service Worker** (`frontend/public/sw.js`) — handles push events and notification clicks (opens `/inbox`). No offline caching — the app requires a connection

### Push Notifications

Users receive push notifications when they get a new letter, even with the app closed or in the background.

#### Subscription flow

1. User activates the toggle in **Profile > Privacy > Push notifications**
2. Browser requests notification permission
3. `pushManager.subscribe()` generates a unique endpoint + p256dh + auth keys
4. Frontend POSTs these to `POST /api/push/subscribe`
5. Backend stores them in the `push_subscriptions` table (one user can have multiple devices)

#### Notification flow

1. User A sends a letter → `LetterService.sendLetter()` saves it
2. After the transaction commits (`afterCommit`):
   - **SSE event** — in-app toast notification (if the recipient has the tab open)
   - **Web Push** — `WebPushService.sendPushToUser()` for each recipient
3. Backend encrypts the payload with the recipient's p256dh + auth keys
4. Signs the request with the VAPID private key
5. Sends to the push service (Google FCM / Mozilla autopush)
6. The service worker on the recipient's device receives the push → shows a system notification
7. Tapping the notification opens `/inbox`

#### VAPID keys

VAPID (Voluntary Application Server Identification) keys authenticate the server as a legitimate push sender:

- **Public key** — used by the frontend (to subscribe) and push services (to verify sender identity)
- **Private key** — used by the backend only, signs each push message
- Generated once with `npx web-push generate-vapid-keys`, stored in `.env.production`

#### Automatic cleanup

When a user uninstalls the app or revokes permissions, the push service responds with **410 Gone**. `WebPushService` detects this and automatically removes the expired subscription from the database.

### Configuration

Add these to `.env.production`:

```
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
```

Generate keys with:
```bash
npx web-push generate-vapid-keys
```
