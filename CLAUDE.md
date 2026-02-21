# CozyLetters 💌 - Project Guidelines

## Tech Stack
- **Frontend:** Next.js 15 (App Router), Bun, Tailwind CSS, Zustand, Framer Motion.
- **Backend:** Java 21, Spring Boot 3.4, Spring Security (OAuth2 + JWT), JPA/Hibernate.
- **Database:** PostgreSQL (Docker).

## UI/UX Vision (Cozy Style)
- **Palette:** Colores crema, terracota suave, verde musgo y madera clara.
- **Feel:** Bordes muy redondeados (`rounded-2xl`), sombras suaves, tipografías Serif para títulos (tipo "Playfair Display") y Sans para lectura.
- **Animations:** Transiciones suaves de opacidad y desplazamientos tipo "deslizar carta".

## Architecture Rules
- **Frontend:** - Usar React Server Components para fetching de datos inicial.
  - Zustand para el estado del usuario y notificaciones.
  - Carpeta `src/components/cozy/` para componentes visuales únicos.
- **Backend:**
  - Auth: Implementar flujo híbrido (Google OAuth2 y Email/Pass tradicional).
  - Logic: El envío de cartas selecciona 5 IDs aleatorios de la tabla `users` (excluyendo al remitente).
  - Seguridad: JWT para comunicación stateless entre Next.js y Spring.

## Critical Commands
- **Infrastructure:** `docker-compose up -d`
- **Frontend:** `cd frontend && bun dev`
- **Backend:** `cd backend && ./mvnw spring-boot:run`