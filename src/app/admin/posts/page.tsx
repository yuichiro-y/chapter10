"use client";

import Link from "next/link";
import { formatDate } from "@/app/_utils/date";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { PostsIndexResponse } from "@/app/api/admin/posts/route";
import useSWR from "swr";

type Posts = PostsIndexResponse["posts"][number];

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    throw new Error("記事一覧の取得に失敗しました");
  }

  const data: PostsIndexResponse = await res.json();
  return data.posts;
};

export default function AdminPostsPage() {
  const { token } = useSupabaseSession();
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<Posts[]>(
    token ? ["/api/admin/posts", token] : null,
    fetcher
  );

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>記事一覧の取得に失敗しました</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          新規作成
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}      

      <ul className="divide-y rounded border">
        {posts?.map((post) => (
          <li key={post.id}>
            <Link
              href={`/admin/posts/${post.id}`}
              className="block p-4 hover:bg-slate-50"
            >
              <div className="font-bold">{post.title}</div>
              <div className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}