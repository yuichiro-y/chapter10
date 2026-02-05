"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/globals.css";
import { MicroCmsPost } from "./_types/MicroCms";


export default function Page() {

  const [posts, setPosts] = useState<MicroCmsPost[]>([])
  // const [posts , setPosts] = useState<Post[]>([]);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetcher = async () => {
      const res = await fetch('https://8hcgph0mr1.microcms.io/api/v1/posts', {// 管理画面で取得したエンドポイントを入力してください。
        headers: {// fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
          'X-MICROCMS-API-KEY': 'lfwYdFwzijXQvN4q6cRwNMIls1HfVdDrjPsf', // 管理画面で取得したAPIキーを入力してください。
        },
      })
      const { contents } = await res.json()
      setPosts(contents)
      setLoading(false)
    }
    
    fetcher()
  }, [])

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

  return (
    <>
    <div className="max-w-2xl mx-auto my-10 px-2">
      <ul>
      {posts.map((post) => (
          <li key={post.id} className="w-auto p-5 mb-10 border border-gray-300">
            <Link href={`/posts/${post.id}`}>

              <div className="flex justify-between">
                <div className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString('ja-JP')}</div>
                {post.categories && (<ul className="flex font-semibold text-sm">
                  {post.categories.map((c)=><li key={c.id} className="border border-blue-500 text-blue-500 rounded-md mr-1.5 px-1.5 py-0.5">{c.name}</li>)}</ul>)}
              </div>

              <div className="flex justify-between w-full">
                <div className="text-left">
                  <h1 className="text-2xl py-3">{post.title}</h1>
                  <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
                <img src={post.thumbnail.url} className="p-3 w-52 max-w-full"/>
              </div>
                
            </Link>
          </li>

      ))}
       </ul>
    </div>
    </>
  );
};