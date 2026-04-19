"use client"

import Link from "next/link"

export default function Adminlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="w-56 bg-slate-100 p-4">
          <nav className="space-y-2">
            <Link href="/admin/posts" className="block p-2 hover:bg-slate-200">
              記事一覧
            </Link>
            <Link href="/admin/categories" className="block p-2 hover:bg-slate-200">
              カテゴリー一覧
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}