"use client"

import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import Link from "next/link"
import { useFetch } from "@/app/_hooks/useFetch";

export default function AdminCategoriesPage() {
  const {
    data,
    error,
    isLoading,
  } = useFetch<CategoriesIndexResponse>(
    "/api/admin/categories"
  );

const categories = data?.categories ?? []

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>カテゴリー一覧の取得に失敗しました</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className="rounded bg-blue-500 px-4 py-2 text-white">
          新規作成
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}

      <ul className="divide-y border rounded">
        {categories?.map((category)=> (
          <li key={category.id}>
            <Link href={`/admin/categories/${category.id}`} className="block p-4 hover:bg-slate-50">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}