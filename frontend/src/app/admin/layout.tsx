"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  UtensilsCrossed,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  UserCircle,
  ChefHat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Órdenes", icon: Receipt },
  { href: "/admin/payments", label: "Verificación", icon: ShieldCheck },
  { href: "/admin/menu", label: "Menú", icon: UtensilsCrossed },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop (hidden on login) */}
      {pathname !== "/admin/login" && (
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-border bg-surface-container shadow-sm z-40">
        {/* Brand */}
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <ChefHat className="size-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-primary">Table Admin</h2>
            <p className="text-xs text-muted-foreground">{user?.restaurantName ?? "Terminal #01"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-surface-container-high hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-accent transition-colors shadow-sm flex items-center justify-center gap-2">
            <ShieldCheck className="size-4" />
            Ver Cola en Vivo
          </button>
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-surface-container-high hover:text-foreground transition-colors">
              <HelpCircle className="size-5" />
              Soporte
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-surface-container-high hover:text-foreground transition-colors"
            >
              <LogOut className="size-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
      )}

      {/* Top Bar - Mobile (hidden on login page) */}
      {pathname !== "/admin/login" && (
        <header className="md:hidden sticky top-0 z-50 flex justify-between items-center px-4 py-3 w-full bg-surface border-b border-border">
          <div className="font-heading text-xl font-bold text-primary">
            {user?.restaurantName ?? "Table Admin"}
          </div>
          <div className="flex items-center gap-2 text-primary">
            <button className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors">
              <Bell className="size-5" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors">
              <UserCircle className="size-5" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 bg-background min-h-screen pb-24 md:pb-8 ${pathname !== "/admin/login" ? "md:ml-64" : ""}`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile (hidden on login) */}
      {pathname !== "/admin/login" && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-3 pt-2 bg-surface border-t border-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      )}
    </div>
  );
}
