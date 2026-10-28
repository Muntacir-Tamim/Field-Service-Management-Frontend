<div align="center">

<img src="public/logo.png" alt="FSM Logo" width="90" />

# Field Service Management — Frontend

**A role-based web app for managing the full life cycle of an on-site service business — from the customer's request to technician dispatch, work completion, bKash payment and feedback.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154)
![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Roles & Dashboards](#roles--dashboards)
4. [Business Workflow](#business-workflow)
5. [Tech Stack](#tech-stack)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Available Scripts](#available-scripts)
9. [Project Structure](#project-structure)
10. [Architecture & Conventions](#architecture--conventions)
11. [Authentication & Route Protection](#authentication--route-protection)
12. [Payment Flow (bKash)](#payment-flow-bkash)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)

---

## Overview

This repository is the **frontend** of the Field Service Management (FSM) system. It is a Next.js (App Router) application that talks to the [FSM Backend](#getting-started) REST API (`/api/v1`).

Three user roles — **Customer**, **Technician** and **Admin** — each get their own dashboard, navigation and permissions:

- **Customers** book services, track progress, pay invoices with bKash and leave feedback.
- **Technicians** confirm assignments, run work orders on site, upload reports and monitor their performance.
- **Admins** review requests, assign technicians, verify work, issue invoices and monitor the whole business through analytics and audit logs.

---

## Key Features

**Public site**

- Marketing pages: Home, Services, About Us, Contact Us
- Customer registration with email OTP verification, login, **Google login**, forgot / reset password
- **Technician application** with document upload and email OTP verification
- One-click **demo login** for Admin, Customer and Technician

**Customer**

- Create service requests with priority and up to 5 attachments
- Track request status and cancel pending requests
- View invoices, **pay online with bKash**, download invoice PDF
- Give and edit feedback after the job is completed

**Technician**

- Confirm or cancel assignments
- Work-order status flow: _en route → arrived → in progress → completed_
- Manage parts used, attachments and service report
- Manage skills and availability; personal performance dashboard and feedback

**Admin**

- Review service requests (under review / approve / reject)
- Search available technicians and create, reschedule or cancel assignments (schedule-conflict aware)
- Verify work orders and create invoices; issue refunds
- Technician onboarding review, skills CRUD, user management (block / unblock / delete)
- Analytics dashboard, technician leaderboard and **audit logs**

**Platform**

- In-app notifications with unread badge
- Server-driven pagination, search, filters and sorting synced to the URL
- Charts powered by Recharts
- Loading skeletons, route-level error boundaries, empty states and confirm dialogs
- Fully responsive UI built on shadcn/ui

---

## Roles & Dashboards

| Role         | Dashboard path | Main areas                                                                                                                    |
| ------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `CUSTOMER`   | `/dashboard`   | Service requests, payments, feedbacks, notifications, profile                                                                 |
| `TECHNICIAN` | `/technician`  | Assignments, work orders, skills, performance, feedbacks, notifications, profile                                              |
| `ADMIN`      | `/admin`       | Service requests, assignments, work orders, technicians, performance, invoices, feedbacks, skills, users, audit logs, profile |

Each area is accessible only by its own role; users who open another role's area are redirected to their own dashboard.

---

## Business Workflow

```
Customer creates Service Request           PENDING
        │
Admin reviews → approves / rejects         UNDER_REVIEW → APPROVED | REJECTED
        │
Admin assigns a technician + time slot     Assignment: PENDING
        │
Technician confirms → Work Order created   SCHEDULED
        │
Technician: en route → arrived → start → complete
        │                                  TECHNICIAN_EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED
Admin verifies the work order              VERIFIED
        │
Admin creates invoice → Customer pays      UNPAID → PAID  (bKash)
        │
Request becomes COMPLETED → Customer leaves feedback
```

---

## Tech Stack

| Category        | Technology                                                              |
| --------------- | ----------------------------------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) (App Router, React Compiler)          |
| UI library      | React 19, TypeScript 5                                                  |
| Styling         | Tailwind CSS v4, `tw-animate-css`, `class-variance-authority`           |
| Components      | shadcn/ui (`base-nova` style) on `@base-ui/react`, `lucide-react`       |
| Server state    | [TanStack Query](https://tanstack.com/query) v5                         |
| Forms           | [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/) v4 |
| HTTP client     | [ofetch](https://github.com/unjs/ofetch) with automatic token refresh   |
| Client state    | Zustand                                                                 |
| Charts          | Recharts                                                                |
| Auth            | Cookie-based JWT (backend) + `@react-oauth/google`                      |
| Dates / OTP     | `date-fns`, `react-day-picker`, `input-otp`                             |
| Lint & format   | [Biome](https://biomejs.dev/)                                           |
| Package manager | [Bun](https://bun.sh/)                                                  |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.x (or Node.js 20+ with npm / pnpm)
- The **FSM Backend** running locally (default: `http://localhost:5000`)
- _(Optional)_ A Google OAuth client ID for Google login

### 1. Start the backend

Follow the backend README: set up PostgreSQL, Redis and the `.env` file, then run:

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev            # http://localhost:5000
```

On startup the backend seeds one **admin** and one **technician** from its `TESTER_*` variables.

### 2. Start the frontend

```bash
# clone and enter the project
git clone <your-frontend-repo-url>
cd Field-Service-Management-Frontend

# install dependencies
bun install

# configure environment
cp .env.example .env.local      # or create .env.local manually (see below)

# run the dev server
bun dev                         # http://localhost:3000
```

Open <http://localhost:3000>.

> **Important:** the backend `FRONTEND_URL` must equal the URL you open in the browser (e.g. `http://localhost:3000`). It is used for CORS and for the payment redirect.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# --- Required ---
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# --- Optional ---
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>

# Demo accounts used by the one-click demo login
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=admin@demo.com
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=Demo@1234
NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL=customer@demo.com
NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD=Demo@1234
NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL=technician@demo.com
NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD=Demo@1234
```

| Variable                       | Required | Description                                                                    |
| ------------------------------ | :------: | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`     |   Yes    | Backend API base URL including `/api/v1`                                       |
| `NEXT_PUBLIC_SITE_URL`         |    No    | Public site URL used for metadata (default `http://localhost:3000`)            |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |    No    | Enables Google login. Use the same client ID as the backend `GOOGLE_CLIENT_ID` |
| `NEXT_PUBLIC_DEMO_*`           |    No    | Credentials for the demo-login buttons. Fall back to the defaults shown above  |

> **Demo accounts:** the demo login only works if these users exist in the backend. The backend automatically seeds an **admin** and a **technician** from `TESTER_ADMIN_*` / `TESTER_TECHNICIAN_*` — set the `NEXT_PUBLIC_DEMO_*` values to match them. The **customer** demo user is not seeded; register one through the app (OTP email required) and use its credentials.

All `NEXT_PUBLIC_*` values are exposed to the browser. Never put secrets in them.

---

## Available Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `bun dev`        | Start the development server         |
| `bun run build`  | Create an optimized production build |
| `bun start`      | Run the production build             |
| `bun run lint`   | Lint & check code with Biome         |
| `bun run format` | Format code with Biome               |

---

## Project Structure

```
src
├── api/              # One file per backend module (thin wrappers over apiClient)
├── app/              # Next.js App Router
│   ├── (public)/     #   marketing pages + authentication pages
│   └── (dashboard)/  #   admin/, technician/, dashboard/ (customer) areas
├── assets/           # SVG logo and static assets
├── components/
│   ├── auth/         #   AuthGuard, RoleGuard, GuestGuard, access denied
│   ├── common/       #   PageHeader, StatCard, StatusBadge, FilterBar, ConfirmDialog …
│   ├── dashboard/    #   Dashboard shell, sidebar, user menu
│   ├── form/         #   Login, register, OTP, reset-password, technician-apply forms
│   ├── layout/       #   Public header & footer
│   ├── modules/      #   Feature UIs (analytics, assignment, payment, work-order …)
│   └── ui/           #   shadcn/ui primitives
├── constants/        # Roles, statuses, query keys, demo accounts, site config
├── hooks/            # TanStack Query hooks, one file per module
├── lib/              # apiClient, token refresh, session helpers, utils, metadata
├── providers/        # Query & Google auth providers
├── routes/           # Per-role route maps and sidebar menus
├── store/            # Zustand stores (auth, UI)
├── types/            # TypeScript types mirroring backend responses
├── utils/            # Formatters, error and query-string helpers
├── validation/       # Zod schemas per module
└── proxy.ts          # Role-based route guard (Next.js 16 proxy)
```

Backend modules covered: `auth`, `user`, `admin-user`, `audit-log`, `skill`, `technician`, `service-request`, `assignment`, `work-order`, `payment`, `feedback`, `notification`, `analytics`.

---

## Architecture & Conventions

**Layer order** — pages stay thin and never call the API directly:

```
app (page)  →  components/modules  →  hooks  →  api  →  lib/apiClient
```

- **Per module, four files:** `types/*.type.ts`, `api/*.api.ts`, `hooks/*.hook.ts`, `validation/*.validation.ts`.
- **Pages** only compose components; logic lives in `components/modules/<module>/`.
- **Server state** lives in TanStack Query (central keys in `constants/query-keys.constant.ts`); **client state** (current user, UI) lives in Zustand.
- **Forms** use TanStack Form with Zod schemas from `validation/`.
- **Roles** are `ADMIN | TECHNICIAN | CUSTOMER`, matching the backend enum exactly.
- **API response shape:** `{ success, message, data, meta? }` — typed in `types/api.type.ts`.
- **Code style** is enforced by Biome (`bun run lint`).

---

## Authentication & Route Protection

1. The backend issues `accessToken` and `refreshToken` as **httpOnly cookies**; the frontend sends them with `credentials: "include"`.
2. `lib/apiClient.ts` automatically calls `/auth/refresh-token` when a request returns `401` and retries the original request once (auth endpoints are excluded).
3. `AuthGuard`, `RoleGuard` and `GuestGuard` protect dashboard and auth pages on the client using the current user (`/auth/me`).
4. `src/proxy.ts` runs before the page renders and uses a small **`fsm_role` routing cookie** (set by the frontend on login) to redirect:
   - signed-out users → `/login`
   - users in the wrong area → their own dashboard
5. The `fsm_role` cookie is only a UX hint. **All real authorization is enforced by the backend** on every request.

> For cross-domain deployments, make sure the backend sets cookies with the correct `SameSite` / `Secure` options and allows your frontend origin in CORS.

---

## Payment Flow (bKash)

1. Admin creates an invoice for a verified work order.
2. Customer clicks **Pay with bKash** on the invoice → the frontend calls `POST /payment/initiate` and redirects the browser to the returned `bkashURL`.
3. After payment, bKash calls the backend callback, which verifies the transaction server-side.
4. The backend redirects back to `/dashboard/payments?status=success|failure|cancel`, where a result banner is shown.
5. Customers and admins can download the invoice as a PDF.

Use the bKash **sandbox** wallet credentials when testing.

---

## Deployment

The app is a standard Next.js project and works on any Next-compatible host (e.g. Vercel).

```bash
bun run build
bun start
```

Checklist:

- [ ] Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL (`https://api.example.com/api/v1`)
- [ ] Set backend `FRONTEND_URL` to the deployed frontend URL (CORS + payment redirect)
- [ ] Serve both apps over **HTTPS** so `Secure` cookies work
- [ ] Add the frontend domain to the Google OAuth client's authorized origins
- [ ] Update the bKash callback URL to the deployed backend

---

<div align="center">

Built with Next.js, TanStack and shadcn/ui.

</div>
