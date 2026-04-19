"use client"

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AdminCategoriesPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
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
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
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
      <div className="mb-6 items-center">
        <h1 className="text-2xl font-bold mb-3">カテゴリー作成</h1>
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
                placeholder="例: React"
              />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
          >
            {isSubmitting ? "作成中..." : "作成する"}
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