# QuickCart — Grocery Delivery Platform

A full-stack grocery delivery platform featuring real-time order tracking, job queue-based driver assignment, and an admin analytics dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Radix UI, shadcn |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Queues** | BullMQ + Redis (job processing) |
| **Real-time** | Socket.io (live order/driver tracking) |
| **State Mgmt** | TanStack React Query, Zustand |
| **Auth** | JWT + better-auth |
| **Storage** | Cloudinary (file uploads) |
| **Analytics** | Recharts (admin dashboard) |
| **Validation** | Zod, Joi |

## Features

### Customer
- Browse stores and products
- Place orders with real-time status updates
- Track delivery driver location via WebSocket

### Driver
- Receive order assignment via BullMQ queue
- Accept/reject orders
- Update delivery status (picked up, in transit, delivered)

### Admin / Store Dashboard
- Manage products, inventory, and orders
- Real-time order dispatch with driver assignment UI
- Sales analytics and revenue charts (Recharts)
- Queue monitoring (BullMQ job status)

### Technical
- RESTful API with JWT authentication + RBAC
- Async job queues for driver dispatch and notifications
- Real-time bidirectional communication via Socket.io
- Optimistic UI updates with TanStack React Query
- Responsive, accessible UI built with Radix UI + Tailwind

## Architecture

```
[React Frontend] ──REST/Socket──> [Express API] ──> [PostgreSQL + Prisma]
                                        │
                                   [BullMQ + Redis]
                                        │
                                   [Socket.io Server] <──> [Driver/Customer]
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis

### Installation

```bash
# Clone the repo
git clone https://github.com/hasnainali567/quick-cart.git
cd quick-cart

# Backend setup
cd backend
cp .env.example .env  # Configure your database URL and Redis URL
npm install
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Environment Variables

```
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secret"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Project Structure

```
quick-cart/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   ├── queues/         # BullMQ job definitions
│   │   └── socket/         # Socket.io event handlers
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities, API client
│   │   └── stores/         # Zustand stores
│   └── package.json
└── README.md
```

## Roadmap

- [ ] AI-powered driver dispatch (OpenAI function calling)
- [ ] Payment gateway integration (JazzCash / Stripe)
- [ ] Customer mobile app (Expo / React Native)
- [ ] Docker + CI/CD deployment
- [ ] End-to-end testing with Playwright

## License

MIT
