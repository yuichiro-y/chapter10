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

export default function AdminPostsEditPage({params}: Props) {
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

  // 記事の情報取得
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${params.id}`, {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
        });

        if (!res.ok) {
          throw new Error("記事の情報の取得に失敗しました");
        }

        const data = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailUrl(data.post.thumbnailUrl);
        //中間テーブル
        setSelectedCategoryIds(
          data.post.postCategories.map(
            (postCategory: { category: { id: number } }) => postCategory.category.id
          )
        );
      } catch (error) {
        console.error(error);
        setErrorMessage("記事の情報の取得に失敗しました");
      }
    }
    fetchPost();
  }, [params.id]);

  // カテゴリーの取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories`, {
          headers: {
            "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
          },
        });

        if (!res.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }

        const data = await res.json();
        setOptionCategories(data.categories);
      } catch (error) {
        console.error(error);
        setErrorMessage("カテゴリの取得に失敗しました");
      }
    }
    fetchCategories();
  }, []);

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

    if (selectedCategoryIds.length === 0) {
      setErrorMessage("カテゴリーを1つ以上選択してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setTitleErrorMessage("");
      setContentErrorMessage("");
      setThumbnailUrlErrorMessage("");

      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          thumbnailUrl: thumbnailUrl.trim(),
          categoryIds: selectedCategoryIds,
        }),
      });

      console.log("status", res)

      if (!res.ok) {
        throw new Error("記事の更新に失敗しました");
      }

      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      setErrorMessage("記事の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDelete = async () => {
    if (!confirm("本当にこの記事を削除しますか？")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
      });

      if (!res.ok) {
        throw new Error("記事の削除に失敗しました");
      }

      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      setErrorMessage("記事の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 items-center">
        <h1 className="text-2xl font-bold mb-2">記事編集</h1>
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