
"use client";

import { useEffect } from "react";
import type { CreateCategoryBody } from "../../api/admin/categories/route";
import { useForm } from "react-hook-form";

export type CategoryFormValues = CreateCategoryBody;

type CategoryFormProps = {
  formId?: string; 
  initialValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export default function CategoryForm({ formId, initialValues, onSubmit }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mt-2 mb-1 block text-sm font-medium">カテゴリー名</label>
        <input
          type="text"
          {...register("name", {
            required: "カテゴリー名を入力してください",
          })}
          placeholder="例：React"
          disabled={isSubmitting}
          className="w-full mb-2 rounded border px-3 py-2 bg-gray-50"
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p> 
        )}
      </div>
    </form>
  )
}