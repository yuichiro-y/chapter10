"use client"

import { useState } from "react";

type Category = {
  id: number;
  name: string;
}

export type PostFormValues = {
  title: string;
  content: string;
  thumbnailUrl: string;
  categoryIds: number[];
}

export type PostFormProps = {
  formId?: string; 
  initialValues: PostFormValues;
  categories: Category[];
  onSubmit: (values: PostFormValues) => Promise<void>;
}

export default function PostForm({ formId, initialValues, categories, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues.thumbnailUrl);
  const [categoryIds, setCategoryIds] = useState<number[]>(initialValues.categoryIds);
  const [, setIsSubmitting] = useState(false);

  const handleCategoryChange = (categoryId: number) => {
    setCategoryIds((prev) => 
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ title, content, thumbnailUrl, categoryIds });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div>
        <label className="mt-2 mb-1 block text-sm font-medium">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mt-2 mb-1 block text-sm font-medium">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={6}
        />
      </div>

      <div>
        <label className="mt-2 mb-1 block text-sm font-medium">サムネイルURL</label>
        <input
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <p className="mt-2 mb-2 text-sm font-medium">カテゴリー</p>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

    </form>
  );
}