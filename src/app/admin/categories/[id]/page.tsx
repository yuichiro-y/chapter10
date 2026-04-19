"use client"

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

type Category = {
  id: number;
  name: string;
};

type CategoryShowResponse = {
  category: Category;
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
        const res = await fetch(`/api/admin/categories/${params.id}`, {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
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
    fetcher();
  }, [params.id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
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
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
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
      <div className="max-w-xl">
        <div className="mb=6">
          <h1 className="text-2xl font-bold mb-3">カテゴリー編集</h1>
        </div>
  
      <form onSubmit={handleSubmit} className="space-y-4 rounded border p-6 mb-5">
        <div>
          <label htmlFor="name" className="mb-2 block font-bold">
            カテゴリー名
          </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3  rounded bg-blue-500 text-white disabled:opacity-50"
          >
            更新する
          </button>

          <button
            type="submit"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-2 py-1 rounded bg-red-500 text-white disabled:opacity-50"
          >
            削除する
          </button>

          <Link
            href="/admin/categories"
            className="px-4 py-2 rounded border"
          >
            戻る
          </Link>
        </div>
      </form>
    </div>
  );
}