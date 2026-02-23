"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const e = email.trim();
      const p = password.trim();

      if (!e || !p) {
        alert("E-posta ve şifre zorunlu.");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", e)
        .eq("password", p)
        .maybeSingle();

      if (error) throw error;

      if (data?.role) {
        localStorage.setItem("role", String(data.role).toLowerCase());
        router.push("/");
      } else {
        alert("Hatalı giriş");
      }
    } catch (err: any) {
      alert("Hata: " + (err?.message ?? "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst mini bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
         <Link href="/" className="font-extrabold text-gray-900 text-lg">
  GKV IB PROJECT <span className="text-gray-500 font-semibold text-sm">(GOKTUG, KAAN, ESLEM)</span>
</Link>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-700 hover:underline"
          >
            Ana sayfa
          </Link>
        </div>
      </div>

      {/* Login Kart */}
      <div className="max-w-6xl mx-auto px-6 py-14 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-7 md:p-8">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500">
              Yönetim Paneli
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
              Giriş Yap
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              Admin paneline erişmek için giriş yap.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                E-posta
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 bg-white"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                type="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Şifre</label>
              <input
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-green-200 bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-green-600 text-white font-bold py-3 hover:bg-green-700 disabled:opacity-60 transition"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

            <div className="mt-3 text-xs text-gray-500">
              Not: Bu proje için kullanıcılar Supabase <b>users</b> tablosundan
              kontrol edilir.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}