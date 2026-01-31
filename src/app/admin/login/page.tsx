"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { StatusModal } from "@/components/ui/StatusModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Success
      setModal({
        isOpen: true,
        type: "success",
        title: "¡Acceso Correcto!",
        message: "Redirigiendo al panel...",
      });

      // Wait 1.5s then redirect
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Error de Acceso",
        message: err.message || "Credenciales inválidas.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <StatusModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
        autoClose={modal.type === "error"} // Auto close only on error, success redirects manually
      />

      <div className="max-w-md w-full bg-white dark:bg-gamer-card border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-xl dark:box-glow">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-gamer-red/10 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-gamer-red">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Ingresá tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:border-gamer-red outline-none transition-colors"
              placeholder="admin@compunor.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-3 text-gray-900 dark:text-white focus:border-gamer-red outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full py-3" glow disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}
