"use client";

import React from "react";
import Link from "next/link";
import { formatDate } from "./_utils/date";
import useSWR from "swr";
import type { PostsIndexResponse } from "./api/posts/route";

type Posts = PostsIndexResponse["posts"][number];

const fetcher = async(url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error("記事一覧の取得に失敗しました");
    }

    const data: PostsIndexResponse = await res.json();
    return data.posts;
  } catch {
    throw new Error("記事一覧の取得に失敗しました");
  } finally {
    clearTimeout(timeoutId);
  } 
} 

export default function Page() {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<Posts[]>(
    "/api/posts",
    fetcher
  );

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>記事一覧の取得に失敗しました</p>;

  return (
    <>
    <div className="max-w-2xl mx-auto my-10 px-2">
      <ul>
        {posts?.map((post) => (
          <li key={post.id} className="w-auto p-5 mb-10 border border-gray-300">
            <ul className="mb-3 flex font-semibold text-sm">
              {post.postCategories.map((c)=>
                <li key={c.category.id} 
                  className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c.category.name}
                </li>)}
            </ul>
            
            <Link href={`/posts/${post.id}`}>
              <div className="mb-3 flex justify-between">
                <h1 className="text-2xl">{post.title}</h1>
                <div className="text-gray-500 text-sm">{formatDate(post.createdAt)}</div>                
              </div>

              <div className="flex justify-between w-full">
                <div className="text-left">                 
                  <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};