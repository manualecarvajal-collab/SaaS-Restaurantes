# Graph Report - .  (2026-07-12)

## Corpus Check
- 140 files · ~59,309 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 810 nodes · 1626 edges · 47 communities (36 shown, 11 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 179 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth & Profile API
- Menu Management
- Dashboard & Restaurants
- Base Models & Order Items
- Core Config & Supabase
- Frontend Package Config
- Payment System
- Order Management
- Table Management
- Admin Dashboard Frontend
- Menu & Cart Frontend
- Commission System
- Project Docs & Specs
- UI Avatar Card Select
- shadcn Component Registry
- Payment Page Frontend
- TypeScript Config
- Base Repository Pattern
- UI Dropdown Menu
- UI Button Dialog
- SuperAdmin Dashboard HTML
- Dashboard Repository
- UI Badge Separator Skeleton
- App Layout & Providers
- API Client & Constants
- UI Table Component
- UI Breadcrumb
- UI Tabs
- ESLint Config
- Next.js Config
- PostCSS Config
- Supabase Client Frontend
- Admin Payments Screenshot
- File Icon SVG
- Globe Icon SVG
- Next.js Logo SVG
- Vercel Logo SVG
- Window Icon SVG
- Backend Package Config

## God Nodes (most connected - your core abstractions)
1. `cn()` - 92 edges
2. `ProfileResponse` - 52 edges
3. `MenuService` - 28 edges
4. `OrderService` - 20 edges
5. `SaaS-Restaurantes` - 19 edges
6. `TableService` - 17 edges
7. `compilerOptions` - 16 edges
8. `OrderResponse` - 15 edges
9. `PaymentResponse` - 15 edges
10. `PaymentService` - 15 edges

## Surprising Connections (you probably didn't know these)
- `SaaS-Restaurantes` --references--> `SaaS-Restaurantes`  [INFERRED]
  README.md → specs/specs.md
- `Next.js Project` --references--> `Next.js`  [INFERRED]
  frontend/README.md → specs/specs.md
- `Table Admin Dashboard` --implements--> `Admin Role`  [INFERRED]
  frontend/admin_payments.html → specs/specs.md
- `SuperAdmin Global Dashboard` --implements--> `SuperAdmin Role`  [INFERRED]
  frontend/superadmin_overview.html → specs/specs.md
- `SaaS-Restaurantes` --references--> `SuperAdmin Global Dashboard`  [INFERRED]
  specs/specs.md → frontend/superadmin_overview.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Hierarchy (SuperAdmin→Admin→Diner)** — specs_specs_specs_superadmin_role, specs_specs_specs_admin_role, specs_specs_specs_diner_role [EXTRACTED 1.00]
- **Payment Verification Flow (Pago Móvil → HITL → Commission)** — specs_specs_specs_pago_movil, specs_specs_specs_human_in_the_loop, specs_specs_specs_commission_system [EXTRACTED 1.00]

## Communities (47 total, 11 thin omitted)

### Community 0 - "Auth & Profile API"
Cohesion: 0.06
Nodes (47): get_current_admin(), get_current_superadmin(), get_current_user(), AsyncSession, create_admin(), list_admins_by_restaurant(), list_all_admins(), AsyncSession (+39 more)

### Community 1 - "Menu Management"
Cohesion: 0.08
Nodes (38): create_category(), create_item(), delete_category(), delete_item(), get_category(), get_item(), list_active_categories(), list_available_items() (+30 more)

### Community 2 - "Dashboard & Restaurants"
Cohesion: 0.08
Nodes (35): get_global_dashboard(), get_recent_orders(), get_restaurant_dashboard(), provision_restaurant(), AsyncSession, BaseModel, UUID, RecentOrdersResponse (+27 more)

### Community 3 - "Base Models & Order Items"
Cohesion: 0.07
Nodes (28): Base, PKMixin, DeclarativeBase, TimestampMixin, OrderItem, Base, OrderStatusHistory, Base (+20 more)

### Community 4 - "Core Config & Supabase"
Cohesion: 0.07
Nodes (39): get_settings(), Settings, create_auth_user(), get_supabase(), get_supabase_admin(), get_user_by_token(), Any, Supabase client utilities.  Provides two clients: - supabase: anon-key client fo (+31 more)

### Community 5 - "Frontend Package Config"
Cohesion: 0.05
Nodes (42): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+34 more)

### Community 6 - "Payment System"
Cohesion: 0.12
Nodes (22): get_payment(), get_payments_by_order(), get_pending_payments(), AsyncSession, UUID, reject_payment(), submit_payment(), verify_payment() (+14 more)

### Community 7 - "Order Management"
Cohesion: 0.14
Nodes (21): create_order(), get_order(), list_orders_by_restaurant(), list_orders_by_table(), list_pending_orders(), AsyncSession, UUID, update_order() (+13 more)

### Community 8 - "Table Management"
Cohesion: 0.13
Nodes (20): create_table(), delete_table(), get_table(), get_table_by_qr(), list_active_tables(), list_tables(), AsyncSession, UUID (+12 more)

### Community 9 - "Admin Dashboard Frontend"
Cohesion: 0.09
Nodes (23): AdminLayout(), navItems, LoginPage(), MOCK_CREDENTIALS, statusFilters, activityIconMap, AdminDashboard(), Activity (+15 more)

### Community 10 - "Menu & Cart Frontend"
Cohesion: 0.13
Nodes (18): CartPage(), FlowStep, MenuContent(), CartSheet(), CategoryTabsProps, MenuItemCard(), MenuItemCardProps, QRScanner() (+10 more)

### Community 11 - "Commission System"
Cohesion: 0.13
Nodes (12): Commission, Base, CommissionRepository, Any, AsyncSession, UUID, CommissionBase, CommissionResponse (+4 more)

### Community 12 - "Project Docs & Specs"
Cohesion: 0.12
Nodes (26): DineFlow, Table Admin Dashboard, Next.js Project, SuperAdmin Global Dashboard, SaaS-Restaurantes, Admin Role, Commission System, Data Isolation (+18 more)

### Community 13 - "UI Avatar Card Select"
Cohesion: 0.14
Nodes (23): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+15 more)

### Community 14 - "shadcn Component Registry"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 15 - "Payment Page Frontend"
Cohesion: 0.14
Nodes (10): Input(), Label(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+2 more)

### Community 16 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 17 - "Base Repository Pattern"
Cohesion: 0.24
Nodes (8): BaseRepository, Any, AsyncSession, UUID, CreateSchemaType, ModelType, ResponseSchemaType, UpdateSchemaType

### Community 18 - "UI Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 19 - "UI Button Dialog"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 20 - "SuperAdmin Dashboard HTML"
Cohesion: 0.18
Nodes (14): Global Dashboard Header with Last Updated Timestamp, KPI Metrics Bento Grid (4 Cards), Mobile Bottom Navigation (Overview, Restros, Finance, Config), Monthly Growth KPI — +14.2% (target exceeded by 2%), Navigation Links (Global Overview, Restaurants, Commissions, Provisioning), Pagination (Showing 1 to 4 of 1,248), Platform Commissions KPI — $420k (+5.2% vs last month), Restaurants Overview Table with Search and Filter (+6 more)

### Community 21 - "Dashboard Repository"
Cohesion: 0.18
Nodes (4): DashboardRepository, AsyncSession, UUID, AsyncSession

### Community 22 - "UI Badge Separator Skeleton"
Cohesion: 0.18
Nodes (7): Badge(), badgeVariants, Separator(), Skeleton(), Switch(), Toggle(), toggleVariants

### Community 23 - "App Layout & Providers"
Cohesion: 0.20
Nodes (6): karla, metadata, nunito, Providers(), TooltipContent(), TooltipProvider()

### Community 24 - "API Client & Constants"
Cohesion: 0.20
Nodes (6): api, ApiError, ORDER_STATUSES, OrderStatus, PAYMENT_STATUSES, PaymentStatus

### Community 25 - "UI Table Component"
Cohesion: 0.22
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 26 - "UI Breadcrumb"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 27 - "UI Tabs"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **118 isolated node(s):** `backend`, `$schema`, `style`, `rsc`, `tsx` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProfileResponse` connect `Auth & Profile API` to `Menu Management`, `Dashboard & Restaurants`, `Payment System`, `Order Management`, `Table Management`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Avatar Card Select` to `Admin Dashboard Frontend`, `Payment Page Frontend`, `UI Dropdown Menu`, `UI Button Dialog`, `UI Badge Separator Skeleton`, `App Layout & Providers`, `UI Table Component`, `UI Breadcrumb`, `UI Tabs`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Base` connect `Base Models & Order Items` to `Menu Management`, `Payment System`, `Order Management`, `Commission System`, `Base Repository Pattern`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `MenuService` (e.g. with `create_category()` and `create_item()`) actually correct?**
  _`MenuService` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `OrderService` (e.g. with `create_order()` and `get_order()`) actually correct?**
  _`OrderService` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Supabase client utilities.  Provides two clients: - supabase: anon-key client fo`, `Get the user-facing Supabase client (anon key).`, `Get the admin Supabase client (service_role key).` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Profile API` be split into smaller, more focused modules?**
  _Cohesion score 0.05765765765765766 - nodes in this community are weakly interconnected._