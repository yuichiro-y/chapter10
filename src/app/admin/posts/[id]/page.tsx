"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/admin/_components/PostForm";
import type { PostFormValues } from "@/app/admin/_components/PostForm";
import { BackButton, DeleteButton, UpdateButton } from "@/app/admin/_components/Button";
import type { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import type { PostShowResponse } from "@/app/api/admin/posts/[id]/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

type Props = {
  params: {
    id: string;
  };
};

export default function AdminPostsEditPage({params}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useSupabaseSession();
  const {
    data: postData,
    error: postError,
    isLoading: isPostLoading,
  } = useFetch<PostShowResponse>(
    `/api/admin/posts/${params.id}`
  );
  const post = postData?.post;
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useFetch<CategoriesIndexResponse>(
    "/api/admin/categories"
  )
  const categories = categoriesData?.categories;  

  useEffect(() => {
    if (!post) return;

    setTitle(post.title);
    setContent(post.content);
    setThumbnailImageKey(post.thumbnailImageKey);
    setSelectedCategoryIds(
      post.postCategories.map((postCategory) => postCategory.category.id)
    );
  },[post]);

  const handleUpdate = async (values: PostFormValues) => {
    if (!token) {
      throw new Error('ログイン情報が取得できません');
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });

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

    if (!token) {
      setErrorMessage("ログイン情報が取得できません");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      
      const res = await fetch(`/api/admin/posts/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
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

  if (isPostLoading || isCategoriesLoading) {
    return <p>Loading...</p>;
  }

  if (postError || categoriesError) {
    return <p>データの取得に失敗しました</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold py-[4px]">記事編集</h1>
      </div>
      <PostForm
        formId="post-edit-form"
        initialValues={{
          title,
          content,
          thumbnailImageKey,
          categoryIds: selectedCategoryIds,
        }}
        categories={categories ?? []}
        onSubmit={handleUpdate}
      />

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}  

      <div className="mt-4 flex gap-3">
        <UpdateButton form="post-edit-form" disabled={isSubmitting}/>
        <DeleteButton onClick={handleDelete} disabled={isSubmitting}/>
        <BackButton href="/admin/posts" />
      </div>
    </div>
  );
}