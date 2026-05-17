"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/app/_utils/date";
import { supabase } from "@/app/_libs/supabase";
import Image from "next/image";


export type Posts = {
  id: string
  title: string
  content: string
  createdAt: string
  thumbnailImageKey: string
  postCategories: {
    category: {
      id: number
      name: string
    };
  }[];
}


export default function PostDetail() {

  const [post, setPost] = useState<Posts | null>(null)
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);
  const { id } = useParams();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );
  const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error("記事一覧の取得に失敗しました");
        }

        const data = await res.json();
        
        setPost(data.post);
        setThumbnailImageKey(data.post.thumbnailImageKey);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id]);

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])
  
  if(loading === true){
    return(
      <div>
        <p className="p-5">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="p-5">データが取得できません。</p>
      </div>
    );
  }

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
        <div className="flex justify-between py-3 items-end">
          <h1 className="text-2xl">{post.title}</h1>
          <div className="text-gray-500 text-sm ">
            {formatDate(post.createdAt)}
          </div>
        </div>  

        {post.postCategories && (
          <ul className="mb-3 flex font-semibold text-sm ">
            {post.postCategories.map((c)=>
              <Link href={`/posts/${post.id}`} key={c.category.id}>
              <li key={c.category.id} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c.category.name}</li>
            </Link>)}
          </ul>
        )}

        <div className="text-left">
          <div className="mb-5" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
};
