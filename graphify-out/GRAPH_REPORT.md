# Graph Report - .  (2026-08-02)

## Corpus Check
- 27 files · ~62,961 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 888 nodes · 1550 edges · 90 communities (41 shown, 49 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 144 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 44
- Community 46
- Community 47
- Community 48
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 56
- Community 58
- Community 59
- Community 60
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89

## God Nodes (most connected - your core abstractions)
1. `cn()` - 90 edges
2. `ProfileResponse` - 46 edges
3. `MenuService` - 33 edges
4. `OrderService` - 20 edges
5. `TableService` - 16 edges
6. `compilerOptions` - 16 edges
7. `OrderResponse` - 15 edges
8. `PaymentResponse` - 15 edges
9. `PaymentService` - 15 edges
10. `Order` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Graphify Knowledge Graph Workflow` --conceptually_related_to--> `Technical Specifications (Single Source of Truth)`  [INFERRED]
  .opencode/instructions.md → specs/specs.md
- `Commission` --uses--> `Base`  [INFERRED]
  backend/models/commission.py → backend/models/base.py
- `OrderItem` --uses--> `Base`  [INFERRED]
  backend/models/order_item.py → backend/models/base.py
- `Order` --uses--> `Base`  [INFERRED]
  backend/models/order.py → backend/models/base.py
- `Payment` --uses--> `Base`  [INFERRED]
  backend/models/payment.py → backend/models/base.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Order-to-Commission Operational Flow** — specs_specs_specs_specs_qr_ordering, specs_specs_specs_specs_order_state_machine, specs_specs_specs_specs_pago_movil, specs_specs_specs_specs_hitl, specs_specs_specs_specs_commission_system, specs_specs_specs_specs_supabase_realtime [EXTRACTED 1.00]
- **Multi-tenant Data Isolation via RLS** — specs_specs_specs_specs_multi_tenant_saas, specs_specs_specs_specs_rls, specs_specs_specs_specs_schema [EXTRACTED 1.00]
- **Supabase Platform Adoption (Auth + Realtime + Migration)** — specs_specs_specs_specs_supabase_auth, specs_specs_specs_specs_supabase_realtime, specs_specs_specs_specs_custom_jwt_auth, specs_specs_specs_specs_frontend_mock [INFERRED 0.85]

## Communities (90 total, 49 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (47): get_current_admin(), get_current_superadmin(), get_current_user(), AsyncSession, create_admin(), list_admins_by_restaurant(), list_all_admins(), AsyncSession (+39 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (29): Base, PKMixin, DeclarativeBase, TimestampMixin, MenuCategory, Base, OrderStatusHistory, Base (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (20): get_commission_total(), get_global_commission_total(), list_commissions(), AsyncSession, UUID, Commission, Base, CommissionRepository (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (40): Any, get_settings(), Settings, main(), Migration runner: executes SQL files against Supabase.  Tries:   1. Direct Postg, Try running SQL via direct database connection., Try running SQL via Supabase SQL API., run_migration() (+32 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (24): BaseModel, create_category(), create_item(), delete_category(), delete_item(), get_category(), get_item(), import_items() (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (23): create_order(), get_order(), list_orders_by_restaurant(), list_orders_by_table(), list_pending_orders(), AsyncSession, UUID, update_order() (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (42): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+34 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (21): get_payment(), get_payments_by_order(), get_pending_payments(), AsyncSession, UUID, reject_payment(), submit_payment(), verify_payment() (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (22): create_table(), delete_table(), get_table(), get_table_by_qr(), list_active_tables(), list_tables(), AsyncSession, UUID (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (26): get_global_dashboard(), get_recent_orders(), get_restaurant_dashboard(), provision_restaurant(), AsyncSession, BaseModel, UUID, RecentOrdersResponse (+18 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (17): create_restaurant(), delete_restaurant(), get_restaurant(), list_restaurants(), AsyncSession, UUID, update_restaurant(), AsyncSession (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (19): CartPage(), FlowStep, MenuContent(), CartSheet(), CategoryTabsProps, MenuItemCard(), MenuItemCardProps, QRScanner() (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (23): CommissionPage(), OrdersPage(), statusFilters, activityIconMap, AdminDashboard(), Activity, addOrder(), AdminOrder (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (17): Category, MenuItemData, ImportResult, MenuImportModal(), Props, Step, Category, MenuItemForm() (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (24): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), SelectContent(), SelectGroup() (+16 more)

### Community 15 - "Community 15"
Cohesion: 0.14
Nodes (11): BaseRepository, Any, AsyncSession, UUID, MenuItemRepository, AsyncSession, UUID, CreateSchemaType (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (18): P2P Fraud Prevention (Unique Bank Reference), CommissionService (backend), Commission System ($0.10 per Confirmed Order), Legacy Custom JWT Auth (removed), Financial Sovereignty / Gateway Decoupling, Mock-based Frontend (current state), Human-in-the-Loop (HITL) Payment Validation, SQL Migration Files (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (8): OrderItem, Base, OrderItemRepository, AsyncSession, UUID, OrderItemCreate, OrderItemResponse, BaseModel

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (7): Badge(), badgeVariants, Input(), Label(), Separator(), Skeleton(), Switch()

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (14): Global Dashboard Header with Last Updated Timestamp, KPI Metrics Bento Grid (4 Cards), Mobile Bottom Navigation (Overview, Restros, Finance, Config), Monthly Growth KPI — +14.2% (target exceeded by 2%), Navigation Links (Global Overview, Restaurants, Commissions, Provisioning), Pagination (Showing 1 to 4 of 1,248), Platform Commissions KPI — $420k (+5.2% vs last month), Restaurants Overview Table with Search and Filter (+6 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (7): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle()

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 29 - "Community 29"
Cohesion: 0.40
Nodes (3): karla, metadata, nunito

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (4): Project Context Instructions (SaaS Restaurants), Graphify Knowledge Graph Workflow, README - SaaS-Restaurantes Overview, Technical Specifications (Single Source of Truth)

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (3): AdminUser, AuthState, useAuthStore

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (3): DineFlow, Table Admin Dashboard, SuperAdmin Global Dashboard

## Knowledge Gaps
- **132 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ProfileResponse` connect `Community 0` to `Community 2`, `Community 5`, `Community 7`, `Community 8`, `Community 9`, `Community 10`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `MenuService` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `OrderService` connect `Community 5` to `Community 7`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `MenuService` (e.g. with `create_category()` and `create_item()`) actually correct?**
  _`MenuService` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `OrderService` (e.g. with `create_order()` and `get_order()`) actually correct?**
  _`OrderService` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Get the user's profile from a Supabase JWT token.`, `Migration runner: executes SQL files against Supabase.  Tries:   1. Direct Postg`, `Try running SQL via direct database connection.` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05030181086519115 - nodes in this community are weakly interconnected._