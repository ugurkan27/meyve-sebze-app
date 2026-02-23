import Link from "next/link";
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

export default async function FoodDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await supabase
    .from("foods")
    .select("id,name,category,calorie,description,image,created_at")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6">
          <h1 className="text-xl font-bold text-slate-900">Not found</h1>
          <p className="text-slate-600 mt-2">This item does not exist.</p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const f = data as Food;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-extrabold text-slate-900">GKV IB PROJECT</div>
          <div className="flex gap-2 text-sm">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-slate-100">
              Home
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 grid gap-6 lg:grid-cols-2">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
            {f.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.image}
                alt={f.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-400 text-sm">No image</span>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="text-sm text-slate-500 mb-2">
            {f.category} {typeof f.calorie === "number" ? `• ${f.calorie} kcal` : ""}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{f.name}</h1>

          {f.description ? (
            <p className="text-slate-700 mt-4 leading-relaxed">{f.description}</p>
          ) : (
            <p className="text-slate-500 mt-4">No description.</p>
          )}

          <Link
            href="/"
            className="inline-block mt-6 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}