# CodeAlpha Restaurant Management System

A backend system for managing restaurant operations — table reservations, orders, inventory-linked recipes, and sales reporting. Built as part of the CodeAlpha Backend Development Internship (Task 3).

**Status:** Complete

## What Makes This Different
Most CRUD restaurant demos stop at basic create/read/update. This project specifically solves two real concurrency problems that arise the moment multiple people use the system at once:

1. **Double-booking prevention** — table reservations use an atomic conditional update, so two simultaneous booking attempts on the same table can never both succeed.
2. **All-or-nothing order fulfillment** — placing an order checks and decrements every required ingredient across every item in a single database transaction. If any ingredient is short, the entire order fails and rolls back completely — no partial orders, no corrupted inventory.

Both guarantees are proven with automated tests that simulate real concurrent requests, not just single-request happy paths.

## Tech Stack
- Node.js + Express + TypeScript
- SQLite + Prisma ORM (v6)
- Vitest for testing

## Data Model
- `Table` — physical tables, with status (`AVAILABLE` / `RESERVED` / `OCCUPIED`)
- `MenuItem` — orderable dishes
- `InventoryItem` — raw stock (ingredients)
- `Recipe` — join table linking a `MenuItem` to the `InventoryItem`s (and quantities) it consumes
- `Reservation` — a booking of a table
- `Order` / `OrderItem` — a placed order and its line items, with price snapshotted at order time

## Setup
```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Testing
```bash
DATABASE_URL="file:./test.db" npx prisma migrate deploy
npm test
```

## API

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/menu` | GET / POST | List / add menu items |
| `/api/menu/:id` | PATCH | Update a menu item |
| `/api/inventory` | GET | List inventory |
| `/api/inventory/low-stock` | GET | Items below their restock threshold |
| `/api/inventory/:id/restock` | PATCH | Add stock |
| `/api/tables` | GET | List tables with status |
| `/api/tables/reservations` | POST | Reserve a table |
| `/api/orders` | POST | Place an order (atomic stock check + decrement) |
| `/api/orders/:id` | GET | Get order details |
| `/api/orders/:id/status` | PATCH | Update order status (enforces valid lifecycle transitions) |
| `/api/reports/daily-sales` | GET | Revenue totals grouped by date |

## Architecture Decisions
See [`docs/adr/`](./docs/adr/).