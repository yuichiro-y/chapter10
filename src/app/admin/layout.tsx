'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouteGuard } from './_hooks/useRouteGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-72px)]">
      {/* サイドバー */}
      <aside className="w-56 bg-slate-100 p-4">
        <Link
          href="/admin/posts"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected('/admin/posts') && 'bg-blue-100'
          }`}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected('/admin/categories') && 'bg-blue-100'
          }`}
        >
          カテゴリー一覧
        </Link>
      </aside>

      {/* メインエリア */}
      <div className="flex-1 p-6">{children}</div>
      </div>
    </>
  )
}