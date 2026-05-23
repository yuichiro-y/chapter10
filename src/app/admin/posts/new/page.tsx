"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/_components/PostForm";
import type { PostFormValues } from "@/app/admin/_components/PostForm";
import { BackButton, CreateButton } from "@/app/admin/_components/Button";
import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Category = CategoriesIndexResponse["categories"][number];

export default function AdminPostsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [thumbnailUrlErrorMessage, setThumbnailUrlErrorMessage] = useState("");
  const [loading,setLoading] = useState(true);
  const { token } = useSupabaseSession();


  useEffect(()=> {
    if (!token) return

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories",{
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          } 
        });

        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  if (loading) return <p>読み込み中...</p>;  

  const handleCreate = async (values: PostFormValues) => {
    if (!token) {
      throw new Error('ログイン情報が取得できません');
    }

    if (!values.title.trim()) {
      setTitleErrorMessage("タイトルを入力してください");
      return;
    }

    if (!values.content.trim()) {
      setContentErrorMessage("記事内容を入力してください");
      return;
    }

    if (!values.thumbnailImageKey.trim()) {
      setThumbnailUrlErrorMessage("サムネイルURLを入力してください");
      return;
    }

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        alert("記事の作成に失敗しました");
        return;
      }

      router.push("/admin/posts");
    };

  return (
    <div>
      <h1 className="text-xl font-bold">新規作成</h1>
      <PostForm
        formId="post-create-form"
        initialValues={{
          title: "",
          content: "",
          thumbnailImageKey: "",
          categoryIds: [],
        }}
        categories={categories}
        onSubmit={handleCreate}
      />

      {titleErrorMessage && (
        <p className="text-sm text-red-500">{titleErrorMessage}</p>
      )}
      {contentErrorMessage && (
        <p className="text-sm text-red-500">{contentErrorMessage}</p>
      )}
      {thumbnailUrlErrorMessage && (
        <p className="text-sm text-red-500">{thumbnailUrlErrorMessage}</p>
      )}

      <div className="mt-4 flex gap-3">
        <CreateButton form="post-create-form" />

        <BackButton href="/admin/posts" />
      </div>
    </div>
  );
}