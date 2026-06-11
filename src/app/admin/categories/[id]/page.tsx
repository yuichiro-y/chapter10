"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateButton, DeleteButton, BackButton } from "@/app/admin/_components/Button";
import CategoryForm from "@/app/admin/_components/CategoryForm";
import type { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import type { CategoryFormValues } from "@/app/admin/_components/CategoryForm";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Props = {
  params: {
    id: string;
  };
};

export default function AdminCategoryEditPage({ params }: Props) {
  const { token }  = useSupabaseSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    data,
    error,
    isLoading,
  } = useFetch<CategoryShowResponse>(
    `/api/admin/categories/${params.id}`
  );

const category = data?.category;

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!values.name.trim()) {
      setErrorMessage("カテゴリー名を入力してください");
      return;
    }

    if (!token) {
      setErrorMessage("ログイン情報が取得できません");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,          
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("カテゴリーの更新に失敗しました");
      }

      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      setErrorMessage("カテゴリーの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const ok =  window.confirm("本当にこのカテゴリーを削除しますか？");
    if (!ok) return;
    
    if (!token) {
      setErrorMessage("ログイン情報が取得できません");
      return;
    }    

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error("カテゴリーの削除に失敗しました");
      }

      router.push("/admin/categories");
    
    } catch (error) {
      console.error(error);
      setErrorMessage("カテゴリーの削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>読み込み中...</p>;  
  if (error) return <p>カテゴリーの取得に失敗しました</p>;
  if (!category) return <p>カテゴリーが見つかりません</p>;  

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold py-[4px]">カテゴリー編集</h1>
      </div>

      <CategoryForm formId="category-edit-form"
        initialValues={{
          name: category.name,
        }}
        onSubmit={handleSubmit}
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="flex gap-3">
        <UpdateButton form="category-edit-form" disabled={isSubmitting}/>
        <DeleteButton onClick={handleDelete} disabled={isSubmitting}/>
        <BackButton href="/admin/categories"/>
      </div>
    </div>
  );
}