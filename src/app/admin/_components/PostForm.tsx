"use client"

import { supabase } from "@/app/_libs/supabase";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ

type Category = {
  id: number;
  name: string;
}

export type PostFormValues = {
  title: string;
  content: string;
  thumbnailImageKey: string;
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
  const [categoryIds, setCategoryIds] = useState<number[]>(initialValues.categoryIds);
  const [, setIsSubmitting] = useState(false);
  const [thumbnailImageKey, setThumbnailImageKey] = useState(initialValues.thumbnailImageKey);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  const handleCategoryChange = (categoryId: number) => {
    setCategoryIds((prev) => 
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ title, content, thumbnailImageKey, categoryIds });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
    ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得

    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path)
  }

  const handleImageDelete = () => {
    setThumbnailImageKey("")
    setThumbnailImageUrl(null)
  } 

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div>
        <label className="mt-2 mb-1 block text-sm font-bold text-gray-700">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mt-2 mb-1 block text-sm font-bold text-gray-700">内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded border px-3 py-2"
          rows={6}
        />
      </div>

      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="mt-2 mb-1 block text-sm font-bold text-gray-700"
        >
          サムネイル画像
        </label>

        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          {thumbnailImageUrl ? (
            <div className="mb-3">
              <p className="mb-2 text-sm text-gray-600">現在の画像</p>
              <div className="relative h-40 w-full overflow-hidden rounded-md bg-white">
                <Image
                  src={thumbnailImageUrl}
                  alt="thumbnail"
                  fill
                  className="object-contain bg-white"
                />
              </div>
            </div>
            
          ) : (
            <div className="mb-3 flex h-40 items-center justify-center rounded-md bg-white text-sm text-gray-400">
              画像が選択されていません
            </div>
            
          )}
          
          <div className="flex ">
            <input
              type="file"
              id="thumbnailImageKey"
              onChange={handleImageChange}
              accept="image/*"
              className="block text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-700"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white"
            >
              画像を削除
            </button>
          </div> 
        </div>
      </div>

      <div>
        <label className="mt-2 mb-1 block text-sm font-bold text-gray-700">カテゴリー</label>
        <div className="space-y-2 ">
          {categories.map((category) => (
            <label 
              key={category.id} 
              className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className=""
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

    </form>
  );
}