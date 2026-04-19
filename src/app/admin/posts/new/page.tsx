"use client"

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type CategoriesIndexResponse = {
  categories: Category[];
};

export default function AdminPostsPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [optionCategories, setOptionCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [thumbnailUrlErrorMessage, setThumbnailUrlErrorMessage] = useState("");


  useEffect(()=> {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
        });
        const data: CategoriesIndexResponse = await res.json();
        setOptionCategories(data.categories);
      } catch (e) {
        console.error(e);
      } 
    };

    fetcher();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setTitleErrorMessage("タイトルを入力してください");
      return;
    }

    if (!content.trim()) {
      setContentErrorMessage("記事内容を入力してください");
      return;
    }

    if (!thumbnailUrl.trim()) {
      setThumbnailUrlErrorMessage("サムネイルURLを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setTitleErrorMessage("");
      setContentErrorMessage("");
      setThumbnailUrlErrorMessage("");

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          thumbnailUrl: thumbnailUrl.trim(),
          categoryIds: selectedCategoryIds.map((id) => ({ id })),
        }),
      });

      console.log("status", res.status)

      const data = await res.json()
      console.log("response", data)

      if (!res.ok) {
        throw new Error("記事の作成に失敗しましたa");
      }

      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      setErrorMessage("記事の作成に失敗しましたb");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 items-center">
        <h1 className="text-2xl font-bold mb-2">記事作成</h1>
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-3 py-6 mb-5">
        <div>
          <label htmlFor="title" className="mb-2 text-sm text-gray-600">
            タイトル
          </label>
          <input 
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {titleErrorMessage && (
          <p className="text-sm text-red-500">{titleErrorMessage}</p>
        )}

        <div>
          <label htmlFor="content" className="mb-2 text-sm text-gray-600">
            記事内容
          </label>
          <textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {contentErrorMessage && (
          <p className="text-sm text-red-500">{contentErrorMessage}</p>
        )}

        <div>
          <label htmlFor="thumbnailUrl" className="mb-2 text-sm text-gray-600">
            サムネイルURL
          </label>
              <input 
                id="thumbnailUrl"
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
        </div>

        {thumbnailUrlErrorMessage && (
          <p className="text-sm text-red-500">{thumbnailUrlErrorMessage}</p>
        )}

        <div>
          <label htmlFor="category" className="mb-2 text-sm text-gray-600">
            カテゴリー
          </label>
            <div className="space-y-2 rounded border p-3">
              {optionCategories.map((category) => (
                <label key={category.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
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
            href="/admin/posts"
            className="px-4 py-2 rounded border"
          >
            戻る
          </Link>
        </div>
      </form>
    </div>
  );
}