"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/_components/PostForm";
import type { PostFormValues } from "@/app/admin/_components/PostForm";
import { BackButton, DeleteButton, UpdateButton } from "@/app/admin/_components/Button";
import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import type { PostShowResponse } from "@/app/api/posts/[id]/route";

type Props = {
  params: {
    id: string;
  };
};

type Category = PostShowResponse["post"]["postCategories"][number]["category"]

export default function AdminPostsEditPage({params}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [, setTitleErrorMessage] = useState("");
  const [, setContentErrorMessage] = useState("");

  // 記事の情報取得
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${params.id}`);

        if (!res.ok) {
          throw new Error("記事の情報の取得に失敗しました");
        }

        const data = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailImageKey(data.post.thumbnailImageKey);
        //中間テーブル
        setSelectedCategoryIds(
          data.post.postCategories.map(
            (postCategory: { category: { id: number } }) => postCategory.category.id
          )
        );

        console.log(data);
        
      } catch (error) {
        console.error(error);
        setErrorMessage("記事の情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  // カテゴリーの取得
  useEffect(() => {
    const fetchCategories = async () => {
        const res = await fetch(`/api/admin/categories`);
        const data: CategoriesIndexResponse = await res.json();
        if (!res.ok) {
          throw new Error("カテゴリの取得に失敗しました");
        }
        setCategories(data.categories);
      };
    fetchCategories();
  }, []);

  const handleUpdate = async (values: PostFormValues) => {
    if (!values.title.trim()) {
      setTitleErrorMessage("タイトルを入力してください");
      return;
    }

    if (!values.content.trim()) {
      setContentErrorMessage("記事内容を入力してください");
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          thumbnailImageKey: values.thumbnailImageKey,
          categoryIds: values.categoryIds,
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

  const handleDelete = async () => {
    if (!confirm("本当にこの記事を削除しますか？")) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "DELETE"
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">記事編集</h1>
      <PostForm
        formId="post-edit-form"
        initialValues={{
          title,
          content,
          thumbnailImageKey,
          categoryIds: selectedCategoryIds,
        }}
        categories={categories}
        onSubmit={handleUpdate}
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}  

      <div className="mt-4 flex gap-3">
        <UpdateButton form="post-edit-form" />
        <DeleteButton onClick={handleDelete} />

        <BackButton href="/admin/posts" />
      </div>
    </div>
  );
}