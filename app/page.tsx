import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Food = {
  id: string;
  name: string;
  category: string;
  calorie: number | null;
  description: string | null;
  image: string | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const kategori = (params?.kategori || "all").toLowerCase();

  let query = supabase
    .from("foods")
    .select("*")
    .order("created_at", { ascending: false });

  if (kategori === "fruit") query = query.ilike("category", "%meyve%");
  if (kategori === "vegetable") query = query.ilike("category", "%sebze%");

  const { data } = await query;
  const foods = (data as Food[]) ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAV */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-extrabold text-lg">
            GKV IB PROJECT{" "}
            <span className="text-slate-500 text-sm">
              (GOKTUG, KAAN, ESLEM)
            </span>
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/login">Login</Link>
            <Link
              href="/admin"
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow p-8">
          <div className="text-xs text-slate-500">
            School Project • Catalog
          </div>

          <h1 className="text-4xl font-extrabold mt-2">
            Fruit & Vegetable Catalog
          </h1>

          <p className="text-slate-600 mt-2">
            Select a category, explore the cards, view details.
          </p>

          <div className="mt-5 flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-green-600 text-white"
            >
              All
            </Link>

            <Link
              href="/?kategori=fruit"
              className="px-4 py-2 rounded-xl border"
            >
              🍎 Fruits
            </Link>

            <Link
              href="/?kategori=vegetable"
              className="px-4 py-2 rounded-xl border"
            >
              🥦 Vegetables
            </Link>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto px-6 pb-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((f) => (
          <div key={f.id} className="bg-white rounded-3xl shadow overflow-hidden">
            {f.image ? (
              <img
                src={f.image}
                alt={f.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-slate-200" />
            )}

            <div className="p-5">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">{f.name}</h2>
                <span>
                  {typeof f.calorie === "number" ? `${f.calorie} kcal` : ""}
                </span>
              </div>

              <p className="text-slate-600 mt-3">
                {f.description || "No description."}
              </p>

              <Link
                href={`/food/${f.id}`}
                className="inline-block mt-4 text-green-600 font-semibold"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}