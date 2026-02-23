import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SearchParams = {
  kategori?: string; // all | fruit | vegetable
};

function normalizeCategory(input?: string) {
  const v = (input || "all").toLowerCase();
  if (v === "meyve") return "fruit";
  if (v === "sebze") return "vegetable";
  if (v === "fruits") return "fruit";
  if (v === "vegetables") return "vegetable";
  if (v === "fruit") return "fruit";
  if (v === "vegetable") return "vegetable";
  return "all";
}

export default async function Home({
  searchParams,
}: {
  // Next 16'da searchParams Promise gelebiliyor:
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const kategori = normalizeCategory(sp?.kategori);

  const { data: foodsRaw, error } = await supabase
    .from("foods")
    .select("id,name,category,calorie,description,image,created_at")
    .order("created_at", { ascending: false });

  const foods = (foodsRaw || []).map((f) => ({
    ...f,
    categoryNorm: (f.category || "").toLowerCase(),
  }));

  const fruitCount = foods.filter((f) => f.categoryNorm.includes("meyve") || f.categoryNorm.includes("fruit")).length;
  const vegCount = foods.filter((f) => f.categoryNorm.includes("sebze") || f.categoryNorm.includes("vegetable")).length;

  const filtered =
    kategori === "fruit"
      ? foods.filter((f) => f.categoryNorm.includes("meyve") || f.categoryNorm.includes("fruit"))
      : kategori === "vegetable"
      ? foods.filter((f) => f.categoryNorm.includes("sebze") || f.categoryNorm.includes("vegetable"))
      : foods;

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-extrabold tracking-tight">
              GKV IB PROJECT <span className="text-slate-500 font-semibold">(GOKTUG, KAAN, ESLEM)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Login
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {/* Sabit yükseklik: resim büyüyüp sayfayı bozmasın */}
          <div className="relative h-56 w-full md:h-72">
            {/* Arka plan görseli - temiz kırpma */}
            {/* İstersen bu resmi public içine koyup /hero.jpg yapabilirsin */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=70')",
              }}
            />
            {/* Üstüne koyu katman, yazı okunaklı olsun */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/40" />
            <div className="relative h-full p-6 md:p-10">
              <div className="text-white/90 text-sm font-semibold">School Project • Catalog</div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Fruit & Vegetable Catalog
              </h1>
              <p className="mt-2 max-w-2xl text-white/85">
                Select a category, explore the cards, view details.
              </p>

              {/* Filters + Stats */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/?kategori=all"
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold border " +
                    (kategori === "all"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white/90 text-slate-900 border-white/30 hover:bg-white")
                  }
                >
                  All
                </Link>
                <Link
                  href="/?kategori=fruit"
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold border " +
                    (kategori === "fruit"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white/90 text-slate-900 border-white/30 hover:bg-white")
                  }
                >
                  🍎 Fruits
                </Link>
                <Link
                  href="/?kategori=vegetable"
                  className={
                    "rounded-full px-4 py-2 text-sm font-bold border " +
                    (kategori === "vegetable"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white/90 text-slate-900 border-white/30 hover:bg-white")
                  }
                >
                  🥦 Vegetables
                </Link>

                <div className="ml-auto flex gap-2">
                  <div className="rounded-2xl bg-white/90 px-4 py-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">Total</div>
                    <div className="text-lg font-extrabold">{foods.length}</div>
                  </div>
                  <div className="rounded-2xl bg-white/90 px-4 py-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">Fruit</div>
                    <div className="text-lg font-extrabold">{fruitCount}</div>
                  </div>
                  <div className="rounded-2xl bg-white/90 px-4 py-2 text-center">
                    <div className="text-xs font-semibold text-slate-500">Vegetable</div>
                    <div className="text-lg font-extrabold">{vegCount}</div>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-white">
                  Supabase error: {error.message}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 pb-12">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-slate-600">
              No items found in this category.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((f) => {
                const isFruit = f.categoryNorm.includes("meyve") || f.categoryNorm.includes("fruit");
                return (
                  <div
                    key={f.id}
                    className="overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Kart görseli: sabit yükseklik + object-cover mantığı */}
                    <div className="h-44 w-full bg-slate-100">
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{
                          backgroundImage: f.image
                            ? `url('${f.image}')`
                            : "url('https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=1200&q=70')",
                        }}
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span
                          className={
                            "rounded-full px-3 py-1 text-xs font-bold " +
                            (isFruit ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")
                          }
                        >
                          {isFruit ? "Fruit" : "Vegetable"}
                        </span>
                        <span className="text-sm font-bold text-slate-700">{f.calorie ?? 0} kcal</span>
                      </div>

                      <div className="mt-3 text-xl font-extrabold tracking-tight">{f.name}</div>

                      {f.description ? (
                        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{f.description}</p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">No description.</p>
                      )}

                      <div className="mt-4">
                        <Link
                          href={`/food/${f.id}`}
                          className="text-green-700 font-bold text-sm hover:text-green-800"
                        >
                          View details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}