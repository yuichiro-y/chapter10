"use client";

import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { PostsIndexResponse } from "../api/admin/posts/route";

type Posts = PostsIndexResponse["posts"][number];

export default function AdminPostsPage() {
  const [, setPosts] = useState<Posts[]>([]);
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

    </div>
  );
}