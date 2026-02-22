# CozyLetters — TODO

## Priority Alta

- [x] **Inbox / Mailbox** — Página para leer cartas recibidas
  - `GET /api/letters/inbox` — endpoint para obtener cartas recibidas
  - Página `/inbox` con lista de cartas y vista de lectura
  - `PATCH /api/letters/:id/read` — marcar cartas como leídas
- [x] **Seed de usuarios** — 10 usuarios seed via data.sql, manejo graceful con pocos usuarios
- [x] **Validación de sesión robusta** — apiFetch con auto-logout en 401

## Priority Media

- [x] **Google OAuth2 real** — OAuth2LoginSuccessHandler, callback page, botón Google en login/register
- [x] **Perfil de usuario** — Página `/profile` para ver/editar displayName, cambiar contraseña
- [ ] **Componentes reutilizables** — Extraer `CozyInput`, `CozyButton`, `CozyCard` en `src/components/cozy/`
- [ ] **Loading states y skeletons** — Indicadores de carga en navegación y listados

## Priority Baja

- [ ] **Rate limiting** — Máx 10 cartas/día por usuario
- [ ] **Responsive polish** — Revisar navbar y formularios en móvil
- [ ] **Tests** — Tests unitarios y de integración (frontend + backend)
- [ ] **Producción** — Variables de entorno, HTTPS, Docker multi-stage, deploy config
