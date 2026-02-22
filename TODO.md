# CozyLetters — TODO

## Priority Alta

- [ ] **Inbox / Mailbox** — Página para leer cartas recibidas
  - `GET /api/letters/inbox` — endpoint para obtener cartas recibidas
  - Página `/inbox` con lista de cartas y vista de lectura
  - `PATCH /api/letters/:id/read` — marcar cartas como leídas
- [ ] **Seed de usuarios** — Manejar el caso de pocos usuarios registrados al enviar cartas
- [ ] **Validación de sesión robusta** — Interceptor/middleware que haga logout automático en 401

## Priority Media

- [ ] **Google OAuth2 real** — Credenciales reales, endpoint callback, flujo frontend completo
- [ ] **Perfil de usuario** — Página `/profile` para ver/editar displayName, cambiar contraseña
- [ ] **Componentes reutilizables** — Extraer `CozyInput`, `CozyButton`, `CozyCard` en `src/components/cozy/`
- [ ] **Loading states y skeletons** — Indicadores de carga en navegación y listados

## Priority Baja

- [ ] **Rate limiting** — Máx 10 cartas/día por usuario
- [ ] **Responsive polish** — Revisar navbar y formularios en móvil
- [ ] **Tests** — Tests unitarios y de integración (frontend + backend)
- [ ] **Producción** — Variables de entorno, HTTPS, Docker multi-stage, deploy config
