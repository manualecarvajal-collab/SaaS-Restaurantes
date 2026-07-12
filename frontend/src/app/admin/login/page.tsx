"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { access_token } = await api.post<{ access_token: string }>(
        "/auth/login",
        { email, password }
      );

      localStorage.setItem("token", access_token);

      const profile = await api.get<{
        id: string;
        email: string;
        full_name: string;
        role: string;
        restaurant_id: string | null;
      }>("/auth/me");

      login(access_token, {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        restaurantId: profile.restaurant_id ?? "",
        restaurantName: "",
      });

      router.push("/admin");
    } catch {
      setError("Correo o contraseña inválidos");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto size-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <ChefHat className="size-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Table Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Inicia sesión para administrar tu restaurante
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@restaurante.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-transparent px-3 pr-10 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <div className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Demo: admin@le-bistrot.com / admin123
        </p>
      </div>
    </div>
  );
}
