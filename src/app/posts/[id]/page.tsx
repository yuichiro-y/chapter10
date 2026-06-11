"use client"

import { useEffect, useState } from "react";
import { formatDate } from "@/app/_utils/date";
import { supabase } from "@/app/_libs/supabase";
import Image from "next/image";
import useSWR from "swr";
import type { PostShowResponse } from "@/app/api/posts/[id]/route";

type Props = {
  params: {
    id: string;
  };
};

const fetcher = async(url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("記事の取得に失敗しました");
  }

  const data: PostShowResponse = await res.json();
  return data.post;
}

export default function PostDetail({params}: Props) {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );
  const {
    data: post,
    error,
    isLoading,
  } = useSWR<PostShowResponse["post"]>(
    `/api/posts/${params.id}`,
    fetcher
  );

  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(post.thumbnailImageKey);

    setThumbnailImageUrl(publicUrl);
  }, [post]);
  
  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>記事の取得に失敗しました</p>;
  if (!post) {
    return (
      <div>
        <p className="p-5">記事が見つかりません。</p>
      </div>
    );
  }

  return (
    <article key={post.id} className="max-w-2xl mx-auto my-10 px-2">
      {thumbnailImageUrl && (
        <div className="mt-2 px-5">
          <Image
            src={thumbnailImageUrl}
            alt="thumbnail"
            width={400}
            height={400}
          />
        </div>
      )}

      <div className="px-5">
        <ul className="my-2 flex font-semibold text-sm">
          {post.postCategories.map((c)=>
            <li key={c.category.id} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">
              {c.category.name}
            </li>
          )}
        </ul>

        <div className="flex justify-between py-3">
          <h1 className="text-2xl">{post.title}</h1>
          <div className="text-gray-500 text-sm">
            {formatDate(post.createdAt)}
          </div>
        </div>  

        <div className="text-left">
          <div className="mb-5" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
};