"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/_components/PostForm";
import type { PostFormValues } from "@/app/admin/_components/PostForm";
import { BackButton, CreateButton } from "@/app/admin/_components/Button";
import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

const categoriesFetcher = async ([url, token]:[string, string]) => {
  const res = await fetch(url ,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    } 
  });

  if (!res.ok) {
    throw new Error("記事データの取得に失敗しました");
  }

  const data: CategoriesIndexResponse = await res.json();
  return data.categories;
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const { token } = useSupabaseSession();
  const {
    data: categories,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useSWR(
    token ? [`/api/admin/categories`, token] : null,
    categoriesFetcher
  );

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

    try {
      setIsSubmitting(true)

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
    } catch (error) {
      console.error(error)
      alert("記事の作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  };

  if (isCategoriesLoading) {
    return <p>Loading...</p>;
  }

  if (categoriesError) {
    return <p>データの取得に失敗しました</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold py-[4px]">記事作成</h1>
      </div>

      <PostForm
        formId="post-create-form"
        initialValues={{
          title: "",
          content: "",
          thumbnailImageKey: "",
          categoryIds: [],
        }}
        categories={categories ?? []}
        onSubmit={handleCreate}
        disabled={isSubmitting}
      />

      {titleErrorMessage && (
        <p className="text-sm text-red-500">{titleErrorMessage}</p>
      )}
      {contentErrorMessage && (
        <p className="text-sm text-red-500">{contentErrorMessage}</p>
      )}

      <div className="mt-4 flex gap-3">
        <CreateButton form="post-create-form" disabled={isSubmitting}/>
        <BackButton href="/admin/posts" />
      </div>
    </div>
  );
}