"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Food = {
  id: string;
  name: string;
  category: string;
  calorie: number | null;
  description: string | null;
  image: string | null;
};

export default function FoodDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState<Food | null>(null);

  useEffect(() => {
    async function run() {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("foods")
        .select("id,name,category,calorie,description,image")
        .eq("id", id)
        .single();

      if (!error && data) setFood(data as Food);
      setLoading(false);
    }

    run();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-2xl p-6 max-w-md w-full">
          <div className="font-bold text-slate-900 mb-2">Missing ID</div>
          <Link className="text-green-700 font-semibold" href="/">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-2xl p-6 max-w-md w-full">
          <div className="font-bold text-slate-900 mb-2">Not found</div>
          <div className="text-slate-600 mb-4">This item does not exist.</div>
          <Link className="text-green-700 font-semibold" href="/">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back
        </Link>

        <div className="mt-4 bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="h-72 bg-slate-100">
            {food.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No image
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">{food.name}</h1>
                <div className="text-slate-600 mt-1">
                  {food.category}
                  {typeof food.calorie === "number" ? ` • ${food.calorie} kcal` : ""}
                </div>
              </div>
            </div>

            {food.description ? (
              <p className="mt-4 text-slate-700 leading-relaxed">{food.description}</p>
            ) : (
              <p className="mt-4 text-slate-500">No description.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}