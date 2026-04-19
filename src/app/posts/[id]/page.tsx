"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
// import Image from "next/image";

export type Posts = {
  id: string
  title: string
  content: string
  createdAt: string
  thumbnailUrl: string
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

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);

        if (!res.ok) {
          throw new Error("記事一覧の取得に失敗しました");
        }

        const data = await res.json();
        
        setPost(data.post);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id]);
  
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
        <img src={post.thumbnailUrl} alt="Thumbnail" className="mb-5" width={200} height={200} />

        <div className="px-5">
          <div className="flex justify-between">
            <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </div>
            {post.postCategories && (<ul className="flex font-semibold text-sm">{post.postCategories.map((c)=>
              <Link href={`/posts/${post.id}`} key={c.category.id}>
              <li key={c.category.id} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c.category.name}</li>
              </Link>)}</ul>)}
            </div>

          <div className="text-left">
            <h1 className="text-2xl py-3">{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

      </div>
    </article>
  );
};