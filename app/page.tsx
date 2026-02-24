"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // BURAYI DEĞİŞTİR (yeni admin bilgilerin)
  const ADMIN_EMAIL = "admin@mail.co";
  const ADMIN_PASSWORD = "123456"; // <- bunu değiştir

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const canLogin = useMemo(() => {
    return email.trim().length > 0 && password.length > 0;
  }, [email, password]);

  function handleLogin() {
    const e = email.trim().toLowerCase();
    const ok =
      e === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

    if (!ok) {
      alert("Hatalı kullanıcı adı veya şifre");
      return;
    }

    // basit yetkilendirme
    localStorage.setItem("role", "admin");
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <div className="mb-6">
          <div className="text-sm text-slate-500">GKV IB PROJECT</div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Login</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Admin paneline giriş yap.
          </p>
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300"
          placeholder="admin@mail.co"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full rounded-xl border px-3 py-2 pr-20 mb-4 outline-none focus:ring-2 focus:ring-green-300"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
            onClick={() => setShow((s) => !s)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={!canLogin}
          className="w-full rounded-xl bg-green-600 text-white font-semibold py-3 disabled:opacity-50"
        >
          Login
        </button>

        <div className="flex items-center justify-between mt-4 text-sm">
          <Link href="/" className="text-slate-600 hover:underline">
            ← Home
          </Link>

          <button
            className="text-slate-600 hover:underline"
            onClick={() => {
              localStorage.removeItem("role");
              alert("Çıkış yapıldı (role temizlendi).");
            }}
          >
            Logout (local)
          </button>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Not: Bu login “gerçek kullanıcı” değil, basit kontrol. Supabase Users listesi
          boş görünmesi normal.
        </div>
      </div>
    </div>
  );
}