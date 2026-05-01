"use client";

import { useState } from "react";
import type { CreateCategoryBody } from "../api/admin/categories/route";

export type CategoryFormValues = CreateCategoryBody;

export type CategoryFormProps = {
  formId?: string; 
  initialValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export default function CategoryForm({ formId, initialValues, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div>
        <label className="mt-2 mb-1 block text-sm font-medium">カテゴリー名</label>
        <input
          type="text"
          value={name}
          placeholder="例：React"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 rounded border px-3 py-2"
        />
      </div>
    </form>
  )
}