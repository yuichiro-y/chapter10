"use client"

import { useEffect, useState } from "react";
import Link from "next/link"

type Category = {
  id: number;
  name: string;
};

type CategoriesIndexResponse = {
  categories: Category[];
};


export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
        });
        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className="rounded bg-blue-500 px-4 py-2 text-white">
          新規作成
        </Link>
      </div>

      <ul className="divide-y border rounded">
        {categories.map((Category)=> (
          <li key={Category.id}>
            <Link href={`/admin/categories/${Category.id}`} className="block p-4 hover:bg-slate-50">
              {Category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}