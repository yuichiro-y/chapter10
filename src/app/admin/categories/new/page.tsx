"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/app/admin/_components/CategoryForm";
import type { CategoryFormValues } from "@/app/admin/_components/CategoryForm";
import { CreateButton, BackButton } from "@/app/admin/_components/Button";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useSupabaseSession();

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!token) {
      throw new Error('ログイン情報が取得できません');
    }

    if (!values.name.trim()) {
      setErrorMessage("カテゴリー名を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("カテゴリーの作成に失敗しました");
      }

      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      setErrorMessage("カテゴリーの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold py-[4px]">カテゴリー作成</h1>
      </div>
  
      <CategoryForm formId="category-create-form"
        initialValues={{
          name: ""
        }}
        onSubmit={handleSubmit}          
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="flex gap-3">
        <CreateButton form="category-create-form" disabled={isSubmitting}/>
        <BackButton href="/admin/categories" />
      </div>
    </div>
  );
}