"use client"

import { supabase } from "@/app/_libs/supabase";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  disabled?: boolean;
}

export default function PostForm({ formId, initialValues, categories, onSubmit }: PostFormProps) {
  const [categoryIds, setCategoryIds] = useState<number[]>(initialValues.categoryIds);
  const [thumbnailImageKey, setThumbnailImageKey] = useState(initialValues.thumbnailImageKey);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>( null, );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues)
    setCategoryIds(initialValues.categoryIds)
    setThumbnailImageKey(initialValues.thumbnailImageKey)
  }, [initialValues, reset])

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
    const nextCategoryIds = categoryIds.includes(categoryId)
      ? categoryIds.filter((id) => id !== categoryId)
      : [...categoryIds, categoryId];

    setCategoryIds(nextCategoryIds);
    setValue("categoryIds", nextCategoryIds);
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
    const { data, error } = await supabase.storage // Supabaseに画像をアップロード
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
    setValue("thumbnailImageKey", data.path)
  }

  const handleImageDelete = () => {
    setThumbnailImageKey("")
    setThumbnailImageUrl(null)
    setValue("thumbnailImageKey", "")
  } 

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      {/* タイトル */}
      <div>
        <label className="mt-2 mb-1 block text-sm font-bold text-gray-700">タイトル</label>
        <input
          type="text"
          {...register("title", {
            required: "タイトルを入力してください",
          })}
          disabled={isSubmitting}
          className="w-full rounded border px-3 py-2"
        />

        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p> 
        )}
      </div>

      {/* 内容 */}
      <div>
        <label className="mt-2 mb-1 block text-sm font-bold text-gray-700">内容</label>
        <textarea
          {...register("content", {
            required: "内容を入力してください",
          })}
          disabled={isSubmitting}
          className="w-full rounded border px-3 py-2"
          rows={6}
        />

        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p> 
        )}        
      </div>

      {/* 画像 */}
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
          <div className="flex">
            <input
              type="file"
              id="thumbnailImageKey"
              onChange={handleImageChange}
              disabled={isSubmitting}
              accept="image/*"
              className="block text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-gray-700"
            />
            <button
              type="button"
              disabled={isSubmitting}              
              onClick={handleImageDelete}
              className="mt-2 rounded bg-red-600 px-3 py-1 text-sm font-bold text-white"
            >
              画像を削除
            </button>
          </div> 
        </div>
      </div>

      {/* カテゴリー選択 */}
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
                disabled={isSubmitting}
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