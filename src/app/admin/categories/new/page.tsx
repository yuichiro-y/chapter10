"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/app/admin/_components/CategoryForm";
import type { CategoryFormValues } from "@/app/admin/_components/CategoryForm";
import { CreateButton, BackButton } from "@/app/admin/_components/Button";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: CategoryFormValues) => {
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
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("カテゴリーの作成に失敗しました");
      }

      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      setErrorMessage("カテゴリーの作成に失敗しましたa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 items-center">
        <h1 className="text-2xl font-bold mb-3">カテゴリー作成</h1>
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
        <CreateButton form="category-create-form" />
        <BackButton href="/admin/categories" />
      </div>
    </div>
  );
}