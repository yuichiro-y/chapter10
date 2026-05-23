"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/app/_utils/date";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { PostsIndexResponse } from "@/app/api/admin/posts/route";

type Posts = PostsIndexResponse["posts"][number];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/posts",{
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          } 
        })

        if (!res.ok) {
          throw new Error("記事一覧の取得に失敗しました");
        }

        const data: PostsIndexResponse = await res.json();
        setPosts(data.posts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [token]);

  if (loading) return <p>読み込み中...</p>;

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

      <ul className="divide-y rounded border">
        {posts.map((post) => (
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