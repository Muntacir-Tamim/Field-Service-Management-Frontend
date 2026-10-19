# Field Service Management — Frontend Final Structure

Next.js (App Router) + TypeScript + TanStack Query + TanStack Form + Zod + ofetch + shadcn/ui (Tailwind v4).
Backend: `http://localhost:5000/api/v1` (cookie auth: `accessToken` + `refreshToken`).

## নিয়ম (Rules)

1. **Layer ক্রম:** `app (page)` → `components/modules` → `hooks` → `api` → `lib/apiClient`। Page এ সরাসরি API call নয়।
2. **প্রতিটা backend module এর জন্য ৪টা file:** `types/*.type.ts`, `api/*.api.ts`, `hooks/*.hook.ts`, `validation/*.validation.ts`।
3. **Page পাতলা রাখো:** page শুধু component বসায়; logic থাকবে `components/modules/<module>/` এ।
4. **Role:** `ADMIN | TECHNICIAN | CUSTOMER` (backend enum এর সাথে হুবহু)।
5. **Response shape:** `{ success, statusCode, message, data, meta }` → `types/api.type.ts`।
6. **Route protection:** client-side (`AuthGuard` / `RoleGuard` / `GuestGuard`)। Cross-domain cookie এর কারণে Next `proxy.ts` ব্যবহার করা হয়নি।

## Folder tree (`src/`)

```
src
├── api
│   ├── admin-user.api.ts
│   ├── analytics.api.ts
│   ├── assignment.api.ts
│   ├── audit-log.api.ts
│   ├── auth.api.ts
│   ├── feedback.api.ts
│   ├── index.ts
│   ├── notification.api.ts
│   ├── payment.api.ts
│   ├── service-request.api.ts
│   ├── skill.api.ts
│   ├── technician.api.ts
│   ├── user.api.ts
│   └── work-order.api.ts
├── app
│   ├── (dashboard)
│   │   ├── admin
│   │   │   ├── assignments
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── audit-logs
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── feedbacks
│   │   │   │   └── page.tsx
│   │   │   ├── invoices
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── service-requests
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── skills
│   │   │   │   └── page.tsx
│   │   │   ├── technician-performance
│   │   │   │   └── page.tsx
│   │   │   ├── technicians
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── users
│   │   │   │   └── page.tsx
│   │   │   ├── work-orders
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   ├── feedbacks
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── payments
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── service-requests
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── technician
│   │   │   ├── assignments
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── feedbacks
│   │   │   │   └── page.tsx
│   │   │   ├── notifications
│   │   │   │   └── page.tsx
│   │   │   ├── performance
│   │   │   │   └── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── skills
│   │   │   │   └── page.tsx
│   │   │   ├── work-orders
│   │   │   │   ├── [id]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── (public)
│   │   ├── (authentication)
│   │   │   ├── apply
│   │   │   │   ├── verify-account
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   ├── verify-account
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── (marketing)
│   │       ├── about-us
│   │       │   └── page.tsx
│   │       ├── contact-us
│   │       │   └── page.tsx
│   │       ├── services
│   │       │   └── page.tsx
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── assets
│   └── svg
│       └── Logo.tsx
├── components
│   ├── auth
│   │   ├── access-denied.tsx
│   │   ├── auth-guard.tsx
│   │   ├── auth-loading.tsx
│   │   ├── guest-guard.tsx
│   │   └── role-guard.tsx
│   ├── common
│   │   ├── confirm-dialog.tsx
│   │   ├── empty-state.tsx
│   │   ├── file-dropzone.tsx
│   │   ├── filter-bar.tsx
│   │   ├── page-header.tsx
│   │   ├── search-input.tsx
│   │   ├── stat-card.tsx
│   │   └── status-badge.tsx
│   ├── dashboard
│   │   ├── dashboard-shell.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   └── user-nav.tsx
│   ├── form
│   │   ├── forgot-password-form.tsx
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── reset-password-form.tsx
│   │   ├── technician-apply-form.tsx
│   │   └── verify-account-form.tsx
│   ├── layout
│   │   └── public
│   │       ├── Footer.tsx
│   │       └── Header.tsx
│   ├── modules
│   │   ├── analytics
│   │   │   ├── admin-stats-cards.tsx
│   │   │   ├── charts.tsx
│   │   │   ├── technician-performance-table.tsx
│   │   │   └── technician-stats-cards.tsx
│   │   ├── assignment
│   │   │   ├── assignment-actions.tsx
│   │   │   ├── assignment-detail.tsx
│   │   │   ├── assignment-list.tsx
│   │   │   ├── assignment-table.tsx
│   │   │   ├── available-technicians.tsx
│   │   │   ├── create-assignment-dialog.tsx
│   │   │   └── reschedule-dialog.tsx
│   │   ├── audit-log
│   │   │   ├── audit-log-detail-sheet.tsx
│   │   │   └── audit-log-table.tsx
│   │   ├── feedback
│   │   │   ├── feedback-card.tsx
│   │   │   ├── feedback-form.tsx
│   │   │   ├── feedback-list.tsx
│   │   │   └── rating-stars.tsx
│   │   ├── google-login
│   │   │   └── GoogleLogin.tsx
│   │   ├── homepage
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── ServicesPreview.tsx
│   │   ├── notification
│   │   │   ├── notification-bell.tsx
│   │   │   └── notification-list.tsx
│   │   ├── payment
│   │   │   ├── invoice-detail.tsx
│   │   │   ├── invoice-list.tsx
│   │   │   ├── invoice-table.tsx
│   │   │   ├── pay-invoice-button.tsx
│   │   │   ├── payment-result-banner.tsx
│   │   │   └── refund-dialog.tsx
│   │   ├── profile
│   │   │   ├── profile-form.tsx
│   │   │   └── profile-image-upload.tsx
│   │   ├── service-request
│   │   │   ├── admin-review-sheet.tsx
│   │   │   ├── cancel-request-dialog.tsx
│   │   │   ├── service-request-detail.tsx
│   │   │   ├── service-request-form.tsx
│   │   │   ├── service-request-list.tsx
│   │   │   └── service-request-table.tsx
│   │   ├── skill
│   │   │   ├── skill-form-dialog.tsx
│   │   │   └── skill-table.tsx
│   │   ├── technician
│   │   │   ├── availability-toggle.tsx
│   │   │   ├── technician-list.tsx
│   │   │   ├── technician-profile-form.tsx
│   │   │   ├── technician-review-sheet.tsx
│   │   │   ├── technician-skills-manager.tsx
│   │   │   └── technician-table.tsx
│   │   ├── user-management
│   │   │   ├── user-status-dialog.tsx
│   │   │   └── user-table.tsx
│   │   └── work-order
│   │       ├── attachments-manager.tsx
│   │       ├── parts-manager.tsx
│   │       ├── service-report-form.tsx
│   │       ├── verify-work-order-dialog.tsx
│   │       ├── work-order-detail.tsx
│   │       ├── work-order-list.tsx
│   │       ├── work-order-status-actions.tsx
│   │       ├── work-order-table.tsx
│   │       └── work-order-timeline.tsx
│   └── ui
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── field.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       ├── table-pagination.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── tooltip.tsx
├── constants
│   ├── index.ts
│   ├── query-keys.constant.ts
│   ├── roles.constant.ts
│   └── status.constant.ts
├── hooks
│   ├── admin-user.hook.ts
│   ├── analytics.hook.ts
│   ├── assignment.hook.ts
│   ├── audit-log.hook.ts
│   ├── auth.hook.ts
│   ├── debounce.hook.ts
│   ├── feedback.hook.ts
│   ├── index.ts
│   ├── notification.hook.ts
│   ├── payment.hook.ts
│   ├── service-request.hook.ts
│   ├── skill.hook.ts
│   ├── technician.hook.ts
│   ├── use-mobile.ts
│   ├── user.hook.ts
│   └── work-order.hook.ts
├── lib
│   ├── apiClient.ts
│   ├── auth-redirect.ts
│   ├── refresh-token.ts
│   └── utils.ts
├── providers
│   ├── google-auth.provider.tsx
│   ├── index.tsx
│   └── query.provider.tsx
├── routes
│   ├── admin.routes.ts
│   ├── customer.routes.ts
│   ├── index.ts
│   └── technician.routes.ts
├── types
│   ├── analytics.type.ts
│   ├── api.type.ts
│   ├── assignment.type.ts
│   ├── audit-log.type.ts
│   ├── auth.type.ts
│   ├── enum.type.ts
│   ├── feedback.type.ts
│   ├── index.ts
│   ├── notification.type.ts
│   ├── payment.type.ts
│   ├── service-request.type.ts
│   ├── sidebar.type.ts
│   ├── skill.type.ts
│   ├── technician.type.ts
│   ├── user.type.ts
│   └── work-order.type.ts
├── utils
│   ├── error.util.ts
│   ├── file-size.util.ts
│   ├── format.util.ts
│   ├── index.ts
│   └── query-string.util.ts
└── validation
    ├── assignment.validation.ts
    ├── auth.validation.ts
    ├── feedback.validation.ts
    ├── index.ts
    ├── payment.validation.ts
    ├── service-request.validation.ts
    ├── skill.validation.ts
    ├── technician-application.validation.ts
    ├── technician-profile.validation.ts
    ├── user.validation.ts
    └── work-order.validation.ts
```

## Route map (page → backend API)

| Frontend route | Role | Backend API |
|---|---|---|
| `/login`, `/register`, `/register/verify-account` | Guest | `POST /auth/login`, `/auth/register`, `/auth/verify-email`, `POST /auth/google` |
| `/forgot-password`, `/reset-password` | Guest | `POST /auth/forgot-password`, `/auth/reset-password` |
| `/apply`, `/apply/verify-account` | Guest | Technician application (`/technicians` apply endpoints) |
| `/services` | Public | `GET /skills` |
| `/dashboard` | Customer | `GET /analytics/*` (customer stats) |
| `/dashboard/service-requests` (+ `/new`, `/[id]`) | Customer | `/service-requests`, `GET /work-orders/service-request/:id` |
| `/dashboard/payments` (+ `/[id]`) | Customer | `/payment/*` (bKash callback → `/dashboard/payments?status=`) |
| `/dashboard/feedbacks` | Customer | `/feedbacks` |
| `/dashboard/notifications`, `/dashboard/profile` | Customer | `/notifications`, `/user/me`, `PATCH /user/*` |
| `/technician` | Technician | `/analytics/*` |
| `/technician/assignments` (+ `/[id]`) | Technician | `/assignments` |
| `/technician/work-orders` (+ `/[id]`) | Technician | `/work-orders/my-work-orders`, `PATCH en-route/arrived/start/complete`, parts, attachments, service-report |
| `/technician/skills`, `/technician/profile` | Technician | `/technicians/*`, `/skills` |
| `/technician/performance`, `/technician/feedbacks`, `/technician/notifications` | Technician | `/analytics`, `/feedbacks`, `/notifications` |
| `/admin` | Admin | `/analytics/*` |
| `/admin/service-requests` (+ `/[id]`) | Admin | `/service-requests` (review/approve/reject) |
| `/admin/assignments` (+ `/[id]`) | Admin | `/assignments` |
| `/admin/work-orders` (+ `/[id]`) | Admin | `/work-orders`, `PATCH /:id/verify` |
| `/admin/technicians` (+ `/[id]`) | Admin | `/technicians` (review/approve) |
| `/admin/technician-performance` | Admin | `/analytics/*` |
| `/admin/skills` | Admin | `/skills` (CRUD) |
| `/admin/invoices` (+ `/[id]`) | Admin | `/payment/invoices`, refund |
| `/admin/feedbacks` | Admin | `/feedbacks` |
| `/admin/users` | Admin | `/admin/users` |
| `/admin/audit-logs` (+ `/[id]`) | Admin | `/admin/audit-logs` |
| `/admin/notifications`, `/admin/profile` | Admin | `/notifications`, `/user/me` |

## Layout এ কোন guard বসবে

| Layout | Guard |
|---|---|
| `(public)/(authentication)/layout.tsx` | `GuestGuard` |
| `(dashboard)/layout.tsx` | `AuthGuard` |
| `(dashboard)/admin/layout.tsx` | `RoleGuard roles=[ADMIN]` + `DashboardShell` |
| `(dashboard)/technician/layout.tsx` | `RoleGuard roles=[TECHNICIAN]` + `DashboardShell` |
| `(dashboard)/dashboard/layout.tsx` | `RoleGuard roles=[CUSTOMER]` + `DashboardShell` |

## এখনো যোগ করতে হবে এমন shadcn component

এই structure এ ui component কম আছে। পরে লাগবে:
`select`, `badge`, `dropdown-menu`, `avatar`, `alert`, `alert-dialog`, `switch`, `scroll-area`, `progress`, `chart` (analytics এর জন্য)।

```bash
bunx shadcn@latest add select badge dropdown-menu avatar alert alert-dialog switch scroll-area progress chart
```

## এই structure এ কী কী যোগ/ঠিক করা হয়েছে

- নতুন: `constants/`, `types/enum.type.ts`, `utils/format|error|query-string.util.ts`, `lib/auth-redirect.ts`, `lib/refresh-token.ts`
- নতুন: `components/auth/guest-guard.tsx`, `(authentication)/layout.tsx`, `(dashboard)/loading.tsx`, `(dashboard)/error.tsx`
- নতুন: `components/common/{search-input,stat-card,file-dropzone,filter-bar}.tsx`, `components/dashboard/user-nav.tsx`
- ঠিক: `package.json` থেকে ভুল `cn` package সরানো হয়েছে
- ঠিক: `app/layout.tsx` এ `<Providers>` এখন `<body>` এর ভেতরে

## কোড লেখার ক্রম

1. `types` + `constants` → 2. `lib/apiClient` + `refresh-token` → 3. `api` → 4. `hooks` (`useGetMe` আগে)
5. `validation` → 6. guards + layouts + sidebar (`routes/*.routes.ts`) → 7. auth pages
8. Customer flow → 9. Technician flow → 10. Admin flow

## Backend এ আগে ঠিক করতে হবে (browser এ test করার আগে)

`auth.controller.ts` এ cookie `secure: false` + `sameSite: "none"` — browser reject করে।
Dev: `sameSite: "lax"`, Production: `secure: true` + `sameSite: "none"`।
