"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Food = {
  id: string;
  name: string;
  category: string;
  calorie: number | null;
  description: string | null;
  image: string | null;
  created_at?: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Meyve" | "Sebze">("Meyve");
  const [calorie, setCalorie] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [foods, setFoods] = useState<Food[]>([]);

  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (!category) return false;
    // kalori boş olabilir, ama yazıldıysa sayı olmalı
    if (calorie.trim() && Number.isNaN(Number(calorie))) return false;
    // image boş olabilir, ama yazıldıysa url gibi olsun
    if (image.trim() && !/^https?:\/\//i.test(image.trim())) return false;
    return true;
  }, [name, category, calorie, image]);

  async function loadFoods() {
    setListLoading(true);
    const { data, error } = await supabase
      .from("foods")
      .select("id,name,category,calorie,description,image,created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setFoods(data as Food[]);
    setListLoading(false);
  }

  useEffect(() => {
    // Basit koruma: login yapılmadıysa login'e at
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!role) router.push("/login");
    loadFoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd() {
    if (!canSave) {
      alert("Lütfen bilgileri kontrol et. (Resim URL ise http/https ile başlamalı)");
      return;
    }

    setLoading(true);
    const payload = {
      name: name.trim(),
      category: category,
      calorie: calorie.trim() ? Number(calorie) : null,
      description: description.trim() ? description.trim() : null,
      image: image.trim() ? image.trim() : null,
    };

    const { error } = await supabase.from("foods").insert([payload]);

    setLoading(false);

    if (error) {
      alert("Hata: " + error.message);
      return;
    }

    setName("");
    setCategory("Meyve");
    setCalorie("");
    setDescription("");
    setImage("");

    await loadFoods();
    alert("Kayıt eklendi!");
  }

  async function handleDelete(id: string) {
    const ok = confirm("Bu kaydı silmek istiyor musun?");
    if (!ok) return;

    const { error } = await supabase.from("foods").delete().eq("id", id);
    if (error) {
      alert("Silme hatası: " + error.message);
      return;
    }
    await loadFoods();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-extrabold text-slate-900">
            GKV IB PROJECT{" "}
            <span className="text-slate-500 font-semibold text-sm">
              (GOKTUG, KAAN, ESLEM)
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-slate-100">
              Home
            </Link>
            <Link href="/login" className="px-3 py-2 rounded-md hover:bg-slate-100">
              Login
            </Link>
            <button
              className="px-3 py-2 rounded-md bg-slate-900 text-white hover:opacity-90"
              onClick={() => {
                localStorage.removeItem("role");
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Add New Item</h1>

          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Apple / Tomato ..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value as "Meyve" | "Sebze")}
          >
            <option value="Meyve">Fruit (Meyve)</option>
            <option value="Sebze">Vegetable (Sebze)</option>
          </select>

          <label className="block text-sm font-medium text-slate-700 mb-1">Calories (optional)</label>
          <input
            className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300"
            placeholder="e.g. 89"
            value={calorie}
            onChange={(e) => setCalorie(e.target.value)}
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Image URL (optional)
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <p className="text-xs text-slate-500 -mt-3 mb-4">
            Şimdilik URL ile gösteriyoruz. İstersen sonra “dosya yükleme” (storage) ekleriz.
          </p>

          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description (optional)
          </label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-green-300 min-h-[110px]"
            placeholder="Short info..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleAdd}
            disabled={!canSave || loading}
            className="w-full rounded-xl bg-green-600 text-white font-semibold py-3 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Records</h2>
            <button
              onClick={loadFoods}
              className="text-sm px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
            >
              Refresh
            </button>
          </div>

          {listLoading ? (
            <div className="text-slate-600">Loading...</div>
          ) : foods.length === 0 ? (
            <div className="text-slate-600">No records yet.</div>
          ) : (
            <div className="grid gap-4">
              {foods.map((f) => (
                <div
                  key={f.id}
                  className="rounded-2xl border p-4 flex gap-4 items-start"
                >
                  <div className="w-28 h-20 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    {f.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">No image</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{f.name}</div>
                        <div className="text-sm text-slate-600">
                          {f.category}
                          {typeof f.calorie === "number" ? ` • ${f.calorie} kcal` : ""}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/food/${f.id}`}
                          className="text-sm px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="text-sm px-3 py-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {f.description ? (
                      <p className="text-sm text-slate-700 mt-2 line-clamp-3">
                        {f.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pb-10" />
    </div>
  );
}