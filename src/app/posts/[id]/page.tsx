"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MicroCmsPost } from "@/app/_types/MicroCms";

export default function PostDetail() {

  const [post, setPost] = useState<MicroCmsPost | null>(null)
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
      const fetcher = async () => {
        setLoading(true)
        const res = await fetch(
          `https://8hcgph0mr1.microcms.io/api/v1/posts/${id}`, // microCMSのエンドポイント
          {
            headers: {
              'X-MICROCMS-API-KEY': 'lfwYdFwzijXQvN4q6cRwNMIls1HfVdDrjPsf', // APIキーをセット
            },
          },
        )
        const data = await res.json()
        setPost(data) // dataをそのままセット
        setLoading(false)
      }

      fetcher()
    }, [id])
  
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
        <img src={post.thumbnail.url} className="mb-5"/>

        <div className="px-5">
          <div className="flex justify-between">
            <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </div>
            {post.categories && (<ul className="flex font-semibold text-sm">{post.categories.map((c)=>
              <li key={c.id} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c.name}</li>)}</ul>)}
            </div>

          <div className="text-left">
            <h1 className="text-2xl py-3">{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

      </div>
    </article>
  );
};