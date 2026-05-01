"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateButton, DeleteButton, BackButton } from "@/app/_components/Button";
import CategoryForm from "@/app/_components/CategoryForm";
import { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import type { CategoryFormValues } from "@/app/_components/CategoryForm";

type Props = {
  params: {
    id: string;
  };
};

export default function AdminCategoryEditPage({ params }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${params.id}`);

        if (!res.ok) {
          throw new Error("カテゴリーの情報の取得に失敗しました");
        }
        
        const data: CategoryShowResponse = await res.json();
        setName(data.category.name);
      } catch (error) {
        console.error(error);
        setErrorMessage("カテゴリーの情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }
    fetcher();
  }, [params.id]);

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!values.name.trim()) {
      setErrorMessage("カテゴリー名を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
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

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <div className="mb=6">
        <h1 className="text-2xl font-bold mb-3">カテゴリー編集</h1>
      </div>

      <CategoryForm formId="category-create-form"
        initialValues={{
          name,
        }}
        onSubmit={handleSubmit}
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="flex gap-3">
        <CreateButton form="category-create-form" />
        <DeleteButton onClick={handleDelete} />
        <BackButton href="/admin/categories"/>
      </div>
    </div>
  );
}