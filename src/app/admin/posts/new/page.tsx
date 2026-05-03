"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/_components/PostForm";
import type { PostFormValues } from "@/app/_components/PostForm";
import { BackButton, CreateButton } from "@/app/_components/Button";
import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";

type Category = CategoriesIndexResponse["categories"][number];

export default function AdminPostsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [thumbnailUrlErrorMessage, setThumbnailUrlErrorMessage] = useState("");

  useEffect(()=> {
    const fetchCategories = async () => {
        const res = await fetch("/api/admin/categories");
        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      };
      
      fetchCategories();
  }, []);

  const handleCreate = async (values: PostFormValues) => {
    if (!values.title.trim()) {
      setTitleErrorMessage("タイトルを入力してください");
      return;
    }

    if (!values.content.trim()) {
      setContentErrorMessage("記事内容を入力してください");
      return;
    }

    if (!values.thumbnailUrl.trim()) {
      setThumbnailUrlErrorMessage("サムネイルURLを入力してください");
      return;
    }

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          thumbnailUrl: "",
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