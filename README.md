# The Reserve

A full-stack restaurant platform where customers can browse the menu, order food online, book tables, leave reviews, and get AI-powered support.

**Live Demo:** [thereserve-restaurant.store](https://www.thereserve-restaurant.store)  
**Backend API:** [the-reserve-server](https://github.com/Jaisan-a-j/the-reserve-server)

---

## Features

- **Authentication** — Email/password registration with OTP verification, JWT sessions, and Google OAuth sign-in
- **Table reservations** — Date/time slot booking with real-time availability, booking limits (max 2 active, one per date), and cancellation
- **Online ordering** — Browse menu, filter by category/diet/spice/price, view food details, and manage a server-side cart
- **Checkout** — Delivery or pickup fulfillment, contact/address validation, service fee + delivery fee + tax calculation, and card or pay-at-counter options
- **Order history** — View past orders and update delivery profile address from the user profile page
- **Reviews** — Submit star ratings and comments after checkout; guest reviews displayed on the homepage
- **Smart menu sections** — Best Sellers, Chef's Specials, New Arrivals, and Trending powered by MongoDB aggregation
- **AI chatbot** — Restaurant assistant powered by Google Gemini with Groq (Llama) fallback
- **Transactional emails** — Registration OTP, booking confirmation, and order confirmation via Resend API
- **Landing page** — Hero, about us, menu categories, team, FAQs, and reviews sections

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **UI** | React 19, TypeScript, Tailwind CSS, Sass, Framer Motion, Swiper |
| **State & data** | Redux Toolkit, TanStack React Query, Axios |
| **Routing** | React Router v7 |
| **Auth** | JWT, Google OAuth (`@react-oauth/google`) |
| **Testing** | Vitest, React Testing Library |
| **Build** | Vite |
| **Deployment** | Vercel / Render, GitHub Actions CI |

---

## Architecture

```
┌─────────────────┐     HTTPS      ┌──────────────────┐
│  React Frontend │ ◄────────────► │  Express REST API │
│  (this repo)    │                │  (backend repo)   │
└────────┬────────┘                └────────┬─────────┘
         │                                  │
    Redux Toolkit                     MongoDB Atlas
    React Query                       JWT + bcrypt
                                      Resend · Gemini · Groq
                                      Google OAuth
```

**State management split:**
- **Redux Toolkit** — Auth, cart, orders, bookings, and chat (global client state + async thunks)
- **Tanstack Query** — Menu data, filters, best sellers, and other server-fetched content with caching

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Home — about, categories, team, reservation, reviews, FAQs |
| `/buy-online` | Menu with filters, cart drawer, and pagination |
| `/buy-online/:foodId` | Food detail page |
| `/checkout` | Checkout flow and post-order review |
| `/profile` | User profile, address, and order history |
| `/auth` | Login, register, OTP verification |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Running backend API ([setup instructions](https://github.com/Jaisan-a-j/the-reserve-server#local-setup))
- MongoDB database (via backend)

### 1. Clone both repositories

```bash
git clone https://github.com/Jaisan-a-j/the-reserve-client.git
git clone https://github.com/Jaisan-a-j/the-reserve-server.git
```

### 2. Configure environment variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Install and run

```bash
cd the-reserve-client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Make sure the backend is running on port `5000` before testing auth, cart, or checkout.

---

## Demo Credentials

You can explore the app by:

1. **Registering** a new account (OTP verification flow), or
2. **Signing in with Google OAuth**

> **Tip for reviewers:** Walk through `/buy-online` → add items to cart → `/checkout` → `/profile` for the full ordering flow. Table booking is on the home page under **Reservation**.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:ci` | Run tests once (used in CI) |
| `npm run lint` | Run ESLint |

---

## Testing

Tests cover critical UI and state logic:

- `src/features/auth/authSlice.test.ts` — Auth reducer behavior
- `src/components/reservation/Reservation.test.tsx` — Reservation form rendering

```bash
npm run test:ci
```

---

## Deployment

- **Frontend CI** — GitHub Actions runs tests and build on push to `main`, then notifies Vercel
- **Production** — Deployed on Render / Vercel with environment variables configured for the API base URL and Google OAuth client ID

---

## Technical Decisions

| Decision | Why |
|----------|-----|
| Redux + React Query | Redux for user session, cart, and mutations; React Query for cached menu/catalog data |
| Server-side cart | Cart persists per user in MongoDB — survives refresh and works across devices when logged in |
| JWT (30-day expiry) | Stateless auth suitable for SPA + REST API architecture |
| Gemini + Groq fallback | Primary AI provider with automatic fallback if Gemini is unavailable |
| Express REST API | Separate backend repo enables independent deployment and clear API boundaries |

---

## Project Structure

```
src/
├── app/              # Redux store
├── components/       # UI components (auth, cart, reservation, chatbot, etc.)
├── features/         # Redux slices and thunks
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Route pages
├── providers/        # Context providers
├── services/         # API service layer (Axios)
├── types/            # TypeScript types
└── utils/            # Helpers and validators
```

---

## Related Repository

| Repo | Link |
|------|------|
| **Backend API** | [github.com/Jaisan-a-j/the-reserve-server](https://github.com/Jaisan-a-j/the-reserve-server) |

---

## Author

Built as a full-stack portfolio project demonstrating end-to-end product development — from UI and state management to API integration, authentication, and cloud deployment.
