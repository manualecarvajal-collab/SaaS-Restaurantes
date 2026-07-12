# specs.md: Technical Specifications — QR Ordering SaaS System

> **Document Type**: Authoritative Architecture & Engineering Standards  
> **Purpose**: Single Source of Truth (SSoT) for AI Orchestrators (Claude Code) and Senior Developers  
> **Core Priorities**: Financial Resilience, Multi-tenant Security, Edge Performance  
> **Status v2.1** — Updated after Session 1: Infrastructure setup + Supabase Auth migration + Seed data (2026-07-08)

---

## Table of Contents

1. [Strategic Product Vision](#1-strategic-product-vision)
2. [Mandatory Technology Stack](#2-mandatory-technology-stack--environment-management)
3. [Data Architecture & Multi-tenant Security](#3-data-architecture--multi-tenant-security-supabase-rls)
4. [System Hierarchy & User Perspectives](#4-system-hierarchy--user-perspectives)
5. [Operational Flow & Hierarchical Userflow](#5-operational-flow--hierarchical-userflow)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Payment System: Pago Móvil (Venezuela)](#7-payment-system-pago-móvil-venezuela)
8. [Commission System](#8-commission-system)
9. [Supabase Realtime Integration](#9-supabase-realtime-integration)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Codebase Audit — Identified Gaps](#11-codebase-audit--identified-gaps)
12. [Migration & Deployment Plan](#12-migration--deployment-plan)
13. [Testing Strategy](#13-testing-strategy)
14. [Appendices](#14-appendices)

---

## 1. Strategic Product Vision

This system positions itself as **critical infrastructure for hospitality industry automation**. In local markets, dependence on international payment gateways represents an operational vulnerability due to predatory fees and settlement delays. This solution integrates the **Human-in-the-loop (HITL)** model as a financial resilience axis: technology optimizes flow, but human control ensures final capital validation, adapting to local payment rails.

### Purpose Analysis

The platform is a **Native Multi-tenant SaaS**. Dynamic QR codes with integrated table identifiers eliminate friction between diner and service, reducing operational latency from menu discovery to payment confirmation.

### Technical Differentiation

Strategic value lies in **decoupling from global payment processors**. By using local P2P Mobile Payments (Pago Móvil Venezuela), merchants avoid the "international gateway trap," achieving immediate cash availability and drastically reduced transaction costs. This financial sovereignty is supported by a software architecture prioritizing **record immutability** and **total data isolation**.

### Target Market

- **Primary**: Venezuela — Pago Móvil (Banesco, Bancamiga, Mercantil, etc.)
- **Payment Flow**: The customer pays via Pago Móvil to the restaurant's bank account. The restaurant receives the full amount. The superadmin (platform owner) collects commissions manually/officially.
- **Commission Model**: $0.10 per confirmed order. Displayed in the receipt as *"Mantenimiento de la App"*. The restaurant receives it from the customer. The superadmin collects it personally from each restaurant.

---

## 2. Mandatory Technology Stack & Environment Management

Dependency hygiene and startup time optimization are critical for serverless and Edge efficiency.

### Core Configuration

| Component | Specification | Rationale |
|-----------|---------------|-----------|
| **Language** | Python 3.14+ (Strict Static Typing) | Optimized Cold Start & reduced memory overhead |
| **Environment Manager** | `uv` (Mandatory & Exclusive) | Rust-based dependency resolution ensures reproducible environments in milliseconds. PEP 723 compliance required |
| **Framework** | FastAPI (Native Async Architecture) | High-performance ASGI framework |
| **Frontend** | Next.js 16.2 + React 19 + TypeScript 5 | App Router, Server Components, Edge-ready |
| **Database** | Supabase (PostgreSQL) | Managed Postgres with built-in Auth & Realtime |

### Critical Dependencies Matrix

#### Backend (`pyproject.toml`)

| Category | Package | Technical Purpose |
|----------|---------|-------------------|
| **Core** | `fastapi[standard]` | High-performance ASGI framework |
| **Validation** | `pydantic>=2.0` | Strict Mode mandatory for schema immutability |
| **DB/SDK** | `supabase` | Official client for Auth, DB & Realtime |
| **ORM/Driver** | `sqlalchemy>=2.0`, `asyncpg` | Repository pattern & non-blocking driver |
| **Auth** | `supabase` (Auth Admin API) | **Replacing python-jose + passlib** — Supabase Auth as SSOT |

#### Frontend (`package.json`)

| Category | Package | Technical Purpose |
|----------|---------|-------------------|
| **Framework** | `next`, `react`, `react-dom` | App Router with RSC |
| **Auth Client** | `@supabase/supabase-js` | Client-side auth & realtime subscriptions |
| **State** | `zustand` | Lightweight client state (cart, auth) |
| **Forms** | `react-hook-form` + `zod` | Form validation |
| **HTTP** | `@supabase/supabase-js` | Direct Supabase queries (no REST proxy needed) |
| **UI** | `lucide-react`, `class-variance-authority`, `tailwind-merge`, `sonner` | Design system utilities |
| **Charts** | `recharts` | Dashboard visualizations |
| **Tables** | `@tanstack/react-table` | Admin data tables |
| **Drag** | `@dnd-kit/core`, `@dnd-kit/sortable` | Menu reordering |

### Infrastructure

- **Deployment**: TBD (Vercel or Railway)
- **Persistence**: Supabase (PostgreSQL + Realtime)
- **Auth**: Supabase Auth (email/password, magic link)
- **File Storage**: Supabase Storage (menu images, logos)

### Supabase Project

- **URL**: `https://otojvmconvlfopaojzgy.supabase.co`
- **Project Ref**: `otojvmconvlfopaojzgy`
- **Region**: `us-west-2`
- **Database Pooler**: `aws-1-us-west-2.pooler.supabase.com`
- **Database Password**: `Restaurantes2026Pro$` (URL-encoded: `Restaurantes2026Pro%24`)

---

## 3. Data Architecture & Multi-tenant Security (Supabase RLS)

Data isolation in a multi-tenant environment must be **absolute**. Security is delegated to the database engine, not the application layer.

### Schema Overview (10 Tables)

```
restaurants (tenants)
├── profiles (extends auth.users)
├── tables (QR-coded)
├── menu_categories
│   └── menu_items
├── orders
│   ├── order_items
│   ├── order_status_history
│   └── payments
└── commissions ($0.10 per confirmed order)
```

### Isolation Logic (RLS)

Row-Level Security (RLS) policies using `restaurant_id` identifier are implemented on all sensitive tables.

Key helper functions:
- `get_user_restaurant_id()` — Returns the restaurant_id for the current authenticated user
- `is_superadmin()` — Boolean check for superadmin role

> [!IMPORTANT]
> **Silent Failure Warning in RLS**: In PostgreSQL, `UPDATE` operations will fail silently (affecting 0 rows without error) if no explicit `SELECT` permission exists on the rows being modified. Policies must be defined to cover both `auth.uid() = restaurant_id` scenarios.

### Async Repository Pattern

To avoid "Detached Instance" errors in async contexts, **passing ORM objects (SQLAlchemy) to the service layer is prohibited**.

- **Mandate**: Repositories must map results to **Pydantic models** before returning data. Business logic only consumes validated, flat schemas.

### P2P Fraud Prevention

Strict backend validation for detecting duplicate bank references using **composite unique indexes** (`restaurant_id`, `bank_reference`).

### SQL Migration Files

| File | Content | Status |
|------|---------|--------|
| `migrations/001_create_tables.sql` | Tables + enums | ✅ Primary (has `hashed_password` column — legacy) |
| `migrations/002_rls_policies.sql` | RLS policies + helper functions | ✅ Primary |
| `migrations/003_seed_data.sql` | Seed data (restaurant, menu, test orders) | ✅ Primary |
| `migrations/000_full_schema.sql` | Combined 001 + 002 (tables + RLS) | ⚠️ Duplicate of full_schema.sql |
| `migrations/full_schema.sql` | Combined tables + RLS (no `hashed_password`) | ⚠️ Duplicate of 000_full_schema.sql |
| `specs/migration_paso1_schema.sql` | Combined schema (sin `hashed_password`) | ✅ Created for fresh deployments |

**Action**: Remove duplicate `000_full_schema.sql` and `full_schema.sql`; keep the numbered migrations (001, 002, 003).

### Database Status (Current)

| Table | Rows | Notes |
|-------|------|-------|
| `restaurants` | 1 | La Cocina de Don Manuel (id: `11111111-1111-1111-1111-111111111111`) |
| `profiles` | 2 | superadmin + admin |
| `tables` | 5 | Mesas 1-5 con QR tokens |
| `orders` | 7 | Todos los estados (PENDING → DELIVERED + CANCELLED) |
| `commissions` | 1 | $0.10 registrada para orden 6 |
| Otras tablas | con datos | Menú completo, pagos, historial |

---

## 4. System Hierarchy & User Perspectives

### Role Breakdown

#### 1. SuperAdmin (Governance)
- **Tenant Instance Management**: Control `is_active` status
- **Deep Observability**: Monitor all restaurants, view accumulated commissions
- **Commission Collection**: Manual collection from each restaurant based on commission_count
- **Dashboard**: Total commissions accrued, total orders across all tenants, per-restaurant stats

#### 2. Admin (Restaurant)
- Menu & table CRUD
- **HITL Dashboard**: Mandatory human verification of P2P payments in real-time
- Order lifecycle management (confirm → prepare → ready → deliver)
- View order history and sales stats
- View accrued commissions for their restaurant

#### 3. Client (Diner)
- Registration-free access via QR. URL with `table_id` injection
- Browse menu by category
- Add items to cart, place order
- View receipt with total + $0.10 commission ("Mantenimiento de la App")
- Send Pago Móvil reference (bank name, reference number, payer phone, payer name)
- Track order status in real-time

### Monetization & Control

**Real-time transaction counter** is the exclusive billing trigger. Admins view accrued $0.10 commissions to avoid discrepancies when the superadmin collects.

---

## 5. Operational Flow & Hierarchical Userflow

### Complete Order Lifecycle

```
1. DINER scans QR → opens menu page → browses categories
2. DINER adds items to cart → enters name → places order
3. ORDER created (status: PENDING)
4. ADMIN sees new order → can chat / prepare
5. DINER completes Pago Móvil → fills form (bank, ref, phone, name)
6. ORDER status → PAYMENT_SENT (Realtime notification to Admin)
7. ADMIN verifies Pago Móvil reference in bank app → clicks "Confirm"
8. ORDER status → CONFIRMED (Commission recorded)
9. ADMIN can set: PREPARING → READY → DELIVERED
10. DINER sees real-time status updates throughout
```

### Real-time Synchronization

System uses Supabase Realtime `postgres_changes` channel to:
- Notify Admin Dashboard of new orders
- Notify Admin Dashboard of payment submissions (`PAYMENT_SENT`)
- Notify Diner of order status changes

### Lifecycle Mapping

```mermaid
graph LR
    A[Provisioning] --> B[Interaction]
    B --> C[Critical State: PAYMENT_SENT]
    C --> D[HITL: Human Validation]
    D --> E[Closure: Confirm Payment]
    E --> F[Realtime Update]
    F --> G[Kitchen Print]
    G --> H[Commission Recording]
```

### Order Status Enum

```sql
'PENDING' → 'PAYMENT_SENT' → 'CONFIRMED' → 'PREPARING' → 'READY' → 'DELIVERED'
                              ↘ 'CANCELLED' (can happen from any state)
```

### Payment Status Enum

```sql
'PENDING' → 'VERIFIED'
          ↘ 'REJECTED'
```

---

## 6. Authentication & Authorization

### Decision: Supabase Auth as Source of Truth ✅ COMPLETED

**The backend's custom JWT implementation (python-jose + passlib) has been REMOVED.**

| Aspect | Before | After | Status |
|--------|----------------------|----------------|--------|
| **Token issuance** | Custom JWT via python-jose | Supabase Auth `supabase.auth.signInWithPassword()` | ✅ |
| **Password hashing** | `passlib[bcrypt]`, `hashed_password` | Supabase Auth handles hashing | ✅ |
| **Token validation** | Custom `jwt.decode()` in `deps.py` | Supabase `supabase.auth.getUser()` via `core/supabase.py` | ✅ |
| **User creation** | Custom signup → hashed_password | Supabase Admin API (`client.auth.admin.create_user()`) | ✅ |
| **Frontend auth** | `localStorage.getItem("token")` | `@supabase/supabase-js` (pendiente) | ⏳ |

### Implementation Completed ✅

1. ✅ `python-jose[cryptography]` and `passlib[bcrypt]` removed from `pyproject.toml` (7 packages uninstalled)
2. ✅ `hashed_password` field removed from `models/profile.py` (column still in DB for backward compat)
3. ✅ `core/security.py` **deleted** — replaced by `core/supabase.py`
4. ✅ `core/supabase.py` **created** — provides:
   - `get_supabase()` / `get_supabase_admin()` — client factories (anon + service_role)
   - `sign_in_with_password(email, password)` — user-facing login
   - `create_auth_user(email, password, email_confirm)` — admin user creation
   - `get_user_by_token(jwt_token)` — JWT validation for protected endpoints
   - `sign_out(jwt_token)` — session revocation
5. ✅ `services/auth.py` rewritten — uses Supabase Auth instead of hashed_password verification
6. ✅ `api/deps.py` rewritten — validates JWT via `get_user_by_token()`
7. ✅ `api/v1/endpoints/admins.py` updated — uses `create_auth_user()` + `update_user_by_id()`
8. ✅ `services/dashboard.py` updated — `provision_restaurant()` uses `create_auth_user()`
9. ✅ Seed users created (see [Credentials](#credentials))

### Auth Flow (Target)

```
SIGNUP: Frontend → Supabase Auth (creates user) → Backend creates profile row
LOGIN:  Frontend → Supabase Auth (returns session) → Backend validates token via admin.getUser()
API:    Frontend sends `Authorization: Bearer <supabase_access_token>` 
        Backend validates using supabase.auth.admin.getUser(token)
```

### Authorization Matrix

| Role | Manage Restaurants | Manage Menu | View Orders | Verify Payments | View Commissions |
|------|-------------------|-------------|-------------|----------------|-----------------|
| **SuperAdmin** | ✅ (all) | ✅ (all) | ✅ (all) | ✅ (all) | ✅ (all) |
| **Admin** | ❌ (own only) | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) |
| **Anonymous** | ❌ | ✅ (read) | ✅ (create own) | ❌ | ❌ |

---

## 7. Payment System: Pago Móvil (Venezuela)

### Overview

Pago Móvil is an inter-bank peer-to-peer payment system in Venezuela. The customer transfers money from their bank app to the restaurant's registered phone number.

### Flow

1. Restaurant registers their Pago Móvil details in the platform:
   - Bank name (e.g., Banesco, Mercantil, Provincial)
   - Titular/Account holder name
   - CI/RIF (VAT ID)
   - Phone number registered for Pago Móvil
2. Customer receives order total + $0.10 commission in the receipt
3. Customer opens their bank app, sends the amount via Pago Móvil
4. Customer submits the payment reference:
   - Bank name used
   - Reference number (bank-generated)
   - Payer phone
   - Payer name
5. Admin sees the pending payment in the dashboard
6. Admin checks their bank app to verify the transfer
7. Admin clicks "Verificar" to confirm the payment
8. Order moves to CONFIRMED, commission is recorded

### Data Model

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    bank_reference TEXT NOT NULL,
    payer_phone TEXT,
    payer_name TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    -- Anti-fraud: unique per restaurant
    UNIQUE(restaurant_id, bank_reference)
);
```

### Anti-Fraud Measures

- `UNIQUE(restaurant_id, bank_reference)` prevents reusing the same bank reference within a restaurant
- HITL (Human-in-the-loop) — admin manually verifies each payment
- Audit trail via `order_status_history` — every status change is logged

### Mock Data

Frontend mock data uses Banesco as the default bank:
```typescript
export const mockBankDetails = {
  bank: "Banesco",
  titular: "Le Bistrot C.A.",
  ciRif: "J-40123456-0",
  phone: "0412-1234567",
};
```

---

## 8. Commission System

### Model

- **Amount**: $0.10 per confirmed order
- **Display**: Shown in the customer receipt as *"Mantenimiento de la App"*
- **Flow**: Customer pays the commission as part of the total → Restaurant receives it → Superadmin collects from restaurant manually
- **Tracking**: `commissions` table records each commission with order and restaurant IDs
- **Aggregation**: `restaurants.commission_count` tracks total commissions per restaurant

### Commission Recording Logic

Commission is created when an order transitions to `CONFIRMED` (payment verified):

```python
# In CommissionService
async def record_commission(self, order_id: UUID, restaurant_id: UUID) -> CommissionResponse:
    commission = await self.repo.create(...)
    # Increment restaurant.commission_count
    await self.restaurant_service.increment_commission_count(restaurant_id)
    return commission
```

### Dashboard Display

The Admin Dashboard must show:
- Total commissions accumulated (e.g., "$0.00" or "$X.XX")
- Commission count (number of confirmed orders)
- Per-restaurant commission history (for superadmin)

> **Important**: `commission_count` is currently set in seed data but NOT automatically updated by any trigger or application logic. This must be implemented in `CommissionService`.

---

## 9. Supabase Realtime Integration

### Requirements

Supabase Realtime `postgres_changes` must be used to:
1. Notify the Admin Dashboard when a new order is created
2. Notify the Admin Dashboard when payment is sent (`PAYMENT_SENT`)
3. Notify the Diner's page when order status changes

### Implementation Plan

- Backend: Enable Realtime on `orders`, `payments`, and `order_status_history` tables
- Backend: Use Supabase Realtime client on the server if needed for server-sent events
- Frontend: Subscribe to Supabase Realtime channels with proper filters

```typescript
// Frontend example
const channel = supabase
  .channel('admin-orders')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
    (payload) => { /* update UI */ }
  )
  .subscribe();
```

---

## 10. Frontend Architecture

### Routes

```
/                          → Menu page (QR scan destination)
/admin/login               → Admin/SuperAdmin login
/admin                     → Dashboard (redirect from /admin)
/admin/orders              → Order management
/admin/menu                → Menu editor
/admin/tables              → Table management
/admin/commissions         → Commission view
/cart                      → Cart page
/payment                   → Payment form (Pago Móvil)
/thank-you                 → Order confirmation
```

### Current State

- **`src/lib/supabase.ts`** — Supabase client configured but NOT used anywhere in components
- **`src/lib/api.ts`** — HTTP client for backend API (uses `NEXT_PUBLIC_API_URL`) but NOT used anywhere
- **`src/lib/mock-data.ts`** — 100% of the menu UI uses mock data (12 menu items, 5 categories)
- **`src/lib/mock-admin.ts`** — 100% of admin UI uses mock data (stats, orders, payments, activities)
- **`src/lib/constants.ts`** — Constants (API URL, order statuses, payment statuses)

**Critical Note**: The entire frontend currently runs on mock data. The API client (`api.ts`) and Supabase client (`supabase.ts`) exist but are not consumed by any component.

### Migration Path (Mock → Real)

1. **Phase 1**: Connect Supabase Auth (login/signup)
2. **Phase 2**: Replace mock menu data with real Supabase queries
3. **Phase 3**: Replace mock admin data with real queries
4. **Phase 4**: Add Realtime subscriptions

---

## 11. Codebase Audit — Identified Gaps

### Architecture Issues

| # | Issue | Priority | Action |
|---|-------|----------|--------|
| 1 | Custom JWT auth (python-jose) vs Supabase Auth | 🔴 High | Rewrite to use Supabase Auth exclusively |
| 2 | `hashed_password` column present in `001_create_tables.sql` but absent in `full_schema.sql` | 🔴 High | Remove column, align all migration files |
| 3 | `commission_count` in restaurants is never auto-updated | 🟡 Medium | Implement in CommissionService |
| 4 | No Supabase Realtime integration | 🟡 Medium | Add postgres_changes subscriptions |
| 5 | Duplicate SQL files (`000_full_schema.sql` = `full_schema.sql`) | 🟢 Low | Remove duplicates |
| 6 | `profiles` model still has `hashed_password` field | 🔴 High | Remove field |

### Frontend Issues

| # | Issue | Priority | Action |
|---|-------|----------|--------|
| 7 | 100% mock data, no real API integration | 🔴 High | Phase-wise migration to Supabase queries |
| 8 | `api.ts` uses REST proxy approach (localStorage token) — obsolete after Supabase Auth | 🟡 Medium | Remove or replace with Supabase direct queries |
| 9 | Realtime not implemented | 🟡 Medium | Add Supabase Realtime subscriptions |
| 10 | No loading/error/success states in current mock components | 🟡 Medium | Add proper states during migration |

### Testing Issues

| # | Issue | Priority | Action |
|---|-------|----------|--------|
| 11 | No test files exist (pytest configured in pyproject.toml) | 🟡 Medium | Add unit tests for services and repositories |
| 12 | No frontend tests | 🟡 Medium | Add component tests |

### Missing Features

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| 13 | Restaurant bank details CRUD | 🟡 Medium | Each restaurant needs to configure Pago Móvil details |
| 14 | Commission dashboard for superadmin | 🟡 Medium | View total commissions across all restaurants |
| 15 | Customer order tracking page | 🟢 Low | Real-time status updates for diner |
| 16 | QR code generation for tables | 🟢 Low | Admin generates QR codes per table |

---

## 12. Migration & Deployment Plan

### ✅ Phase 1: Infrastructure (Completed)
- [x] `.env` created with Supabase credentials
- [x] `frontend/.env.local` created
- [x] Database connection established (Session Pooler, us-west-2)
- [x] Backend verified: starts on `localhost:8000`, health check OK
- [x] `specs/migration_paso1_schema.sql` — migration script ready
- [x] Schema verified: 10 tables with seed data (1 restaurant, 5 tables, 7 orders)
  
### ✅ Phase 2: Authentication Rewrite (Completed)
- [x] `python-jose[cryptography]` and `passlib[bcrypt]` removed from dependencies
- [x] `core/security.py` deleted
- [x] `core/supabase.py` created — Supabase client utilities (anon + service_role)
- [x] `services/auth.py` rewritten — uses Supabase Auth
- [x] `api/deps.py` rewritten — validates tokens via Supabase Auth `get_user()`
- [x] `models/profile.py` — `hashed_password` field removed
- [x] `schemas/profile.py` — `SuperAdminCreate` added
- [x] `api/v1/endpoints/admins.py` — uses `create_auth_user()` + `update_user_by_id()`
- [x] `services/dashboard.py` — uses `create_auth_user()` instead of `get_password_hash()`
- [x] Seed users created in Supabase Auth + profiles table
- [ ] Frontend: `@supabase/supabase-js` for auth (pending)

### Phase 3: Frontend Real Data
- [ ] Connect login page to real Supabase Auth (replace mock)
- [ ] Connect menu page to Supabase queries
- [ ] Connect cart/order flow to Supabase
- [ ] Connect admin dashboard to real data
- [ ] Add Realtime subscriptions

### Phase 4: Features & Polish
- [ ] Commission dashboard (superadmin view)
- [ ] `commission_count` auto-update in CommissionService
- [ ] QR code generation for tables
- [ ] Customer order tracking page
- [ ] Testing (backend + frontend)
- [ ] Deploy to production

---

## 13. Testing Strategy

### Backend (pytest + pytest-asyncio)

- **Unit tests**: Services (auth, order, payment, commission, menu, restaurant, table, dashboard)
- **Repository tests**: Each repository with mocked async session
- **Endpoint tests**: FastAPI TestClient with mocked dependencies
- **Coverage target**: Minimum 70% for services and repositories

### Frontend (TBD)

- Component tests with React Testing Library
- Integration tests for critical flows (order → payment → confirmation)

---

## 14. Appendices

### A. Credentials

#### Supabase Project

| Variable | Value |
|----------|-------|
| **URL** | `https://otojvmconvlfopaojzgy.supabase.co` |
| **Project Ref** | `otojvmconvlfopaojzgy` |
| **Region** | `us-west-2` |
| **Anon Key** | `sb_publishable_<your-key>` |
| **Service Role Key** | `sb_secret_<your-key>` |
| **DB Password** | `********` |

#### Connection Strings

**Session Pooler (5432):**
```
postgresql+asyncpg://postgres.<project-ref>:<password>@aws-1-us-west-2.pooler.supabase.com:5432/postgres
```

**Direct Connection (Dashboard):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.<project-ref>.supabase.co:5432/postgres
```

#### Seed Users

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | `superadmin@example.com` | `superadmin123` |
| **Admin** | `admin@lacocina.com` | `admin123` |

#### Example `.env` File

```env
# Supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=sb_publishable_<your-key>
SUPABASE_SERVICE_KEY=sb_secret_<your-key>

# Database (Session Pooler - us-west-2)
DATABASE_URL=postgresql+asyncpg://postgres.<project-ref>:<password>@aws-1-us-west-2.pooler.supabase.com:5432/postgres

# App
ENVIRONMENT=development
SITE_URL=http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=10080
COMMISSION_AMOUNT=0.10
COMMISSION_CURRENCY=USD
```

#### Example `frontend/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://otojvmconvlfopaojzgy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9fsuZV9ZuENIH5Zu5sYxqw_MsTDxqns
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> **Note**: The `DATABASE_URL` uses the Session Pooler on port 5432 with `postgres.PROJECT_REF` as the username format. The `%24` is URL encoding for `$` in the password. Direct connection (`db.REF.supabase.co:5432`) requires adding the client IP to Supabase's Network Restrictions.

### B. Useful Commands

```bash
# Backend
uv run uvicorn main:app --reload
uv run pytest
uv run python scripts/migrate.py
uv run python scripts/seed.py
uv add <package>

# Frontend
npm run dev
npm run build
npm run lint
```

### C. Related Documents

- `README.md` — Project overview
- `backend/pyproject.toml` — Python dependencies
- `frontend/package.json` — Frontend dependencies
- `backend/migrations/` — SQL migration files
