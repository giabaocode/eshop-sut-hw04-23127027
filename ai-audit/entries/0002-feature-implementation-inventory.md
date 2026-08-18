# Interaction 0002

## AI tool

OpenAI Codex CLI 0.147.0

## ISO date/time
2026-08-18T01:27:52Z

## Exact prompt

````text
Act as an implementation-inventory assistant for HW04 student 23127027. Inspect only repository documentation and source files relevant to FR-01 Account registration, FR-07 Shopping cart, and FR-12 Access control. Produce a concise Markdown table with columns: Feature, frontend files/components, backend routes or middleware, client state or data storage, and evidence as file:line. Do not propose test cases. Do not modify files. Do not label any discrepancy as a bug. Explicitly mark anything not found.
````

## Exact AI output
````text
Implementation inventory based only on scoped documentation and source files. “Not found” means no corresponding implementation was located in those files.

| Feature | Frontend files/components | Backend routes or middleware | Client state or data storage | Evidence as file:line |
|---|---|---|---|---|
| **FR-01 Account registration** | Web: `Register` form and `/register` route; collects name, email, and password, then redirects to login. Mobile: `renderRegister` and `handleRegister` with local password validation. **Not found:** confirmation-password field in either client; admin registration UI. | `POST /api/register` inserts name, email, and password into `users`. **Not found:** route middleware, backend input/password-strength validation, password hashing, or explicit email-uniqueness enforcement. | Web and mobile form values use transient React state. Registered accounts are stored in SQLite’s `users` table; its `role` defaults to `user`. Registration-state persistence: **Not found**. | Requirements: `README.md:30-36`.<br>Web: `frontend-web/src/App.jsx:50-58`, `frontend-web/src/pages/Register.jsx:5-28`, `frontend-web/src/pages/Register.jsx:34-67`.<br>Mobile: `frontend-mobile/App.js:42-46`, `frontend-mobile/App.js:209-240`, `frontend-mobile/App.js:797-837`.<br>Backend/storage: `backend/server.js:20-30`, `backend/database.js:48-61`. |
| **FR-07 Shopping cart** | Web: `Home` and `ProductDetail` add items; `Cart` displays/removes items and total; `CartProvider` supplies cart operations. Mobile: product detail, `addToCart`, and `renderCart`; duplicate product IDs are merged. **Not found:** deletion confirmation or empty-cart illustration in web/mobile; web quantity adjustment controls. | Authenticated `GET /api/cart` and `POST /api/cart`; carts are held in the server’s `userCarts` object. **Not found:** update/delete cart routes or calls to these cart routes from the web/mobile clients. | Web: in-memory `CartContext` state; adding always appends. Mobile: in-memory component state with duplicate-item merging. Server: in-memory cart arrays keyed by user ID. Persistent cart table/storage: **Not found**. | Requirements: `README.md:93-100`; API docs: `api_specification.md:110-127`.<br>Web: `frontend-web/src/context/CartContext.jsx:5-30`, `frontend-web/src/pages/Home.jsx:97-102`, `frontend-web/src/pages/ProductDetail.jsx:21-30`, `frontend-web/src/pages/Cart.jsx:6-76`.<br>Mobile: `frontend-mobile/App.js:61-77`, `frontend-mobile/App.js:134-159`, `frontend-mobile/App.js:590-655`.<br>Backend: `backend/server.js:14`, `backend/server.js:284-295`; database table initialization: `backend/database.js:15-20`. |
| **FR-12 Access control** | Separate admin `App` provides a login gate, checks `res.data.user.role === "admin"`, and renders admin functions only when a token exists. **Not found:** admin-access components in the customer web or mobile clients. | Login JWT contains `id` and `role`; `authenticateToken` verifies JWTs. Admin routes use this token middleware. Product mutations have no middleware; category and admin coupon mutations use token authentication. Role-checking backend middleware or a server-side `role === "admin"` authorization check: **Not found**. | Admin token is held in React state and persisted as `localStorage.adminToken`; it becomes Axios’s default Authorization header. Server roles reside in SQLite and are embedded in JWTs. Persisted client-side role state: **Not found**. | Requirements: `README.md:174-179`; API docs: `api_specification.md:171-181`.<br>Admin client: `frontend-admin/src/App.jsx:7-10`, `frontend-admin/src/App.jsx:34-70`, `frontend-admin/src/App.jsx:188-215`, `frontend-admin/src/App.jsx:263-268`.<br>JWT/middleware: `backend/server.js:46-52`, `backend/server.js:100-110`.<br>Product routes: `backend/server.js:167-196`; category routes: `backend/server.js:249-278`; admin routes: `backend/server.js:199-241`, `backend/server.js:457-488`, `backend/server.js:494-568`.<br>Role storage: `backend/database.js:48-61`. |
````

## Human review/action
Tôi đã đối chiếu các dẫn chiếu web và backend cho FR-01, FR-07 và FR-12; các nhận định chính phù hợp source. Tôi loại phần frontend-mobile khỏi test basis HW04 vì phạm vi Playwright là web. Các discrepancy được giữ làm test target và chưa được báo cáo là defect khi chưa có execution evidence.
