"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateButton, DeleteButton, BackButton } from "@/app/admin/_components/Button";
import CategoryForm from "@/app/admin/_components/CategoryForm";
import { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import type { CategoryFormValues } from "@/app/admin/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type Props = {
  params: {
    id: string;
  };
};

export default function AdminCategoryEditPage({ params }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useSupabaseSession();

  useEffect(() => {  
    const fetcheCategories = async () => {
      if (!token) return;

      try {
        const res = await fetch(`/api/admin/categories/${params.id}`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          } 
        });

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
    fetcheCategories();
  }, [params.id,token]);

  const handleSubmit = async (values: CategoryFormValues) => {
    if (!values.name.trim()) {
      setErrorMessage("カテゴリー名を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!token) return;
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

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!token) {
        setErrorMessage("ログイン情報が取得できません");
        return;
      }

      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: "DELETE",
        headers: {
          Authrization: token,
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

      <CategoryForm formId="category-edit-form"
        initialValues={{
          name,
        }}
        onSubmit={handleSubmit}
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="flex gap-3">
        <UpdateButton form="category-edit-form" />
        <DeleteButton onClick={handleDelete} />
        <BackButton href="/admin/categories"/>
      </div>
    </div>
  );
}