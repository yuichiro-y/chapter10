"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  createdAt: string;
};

type PostsIndexResponse = {
  posts: Post[];
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
        });

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
  }, []);

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
                {post.createdAt}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}