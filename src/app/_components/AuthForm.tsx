"use client"

import React, { useState } from "react";
import { Button } from "./Button";
import { useForm } from "react-hook-form";

export type AuthFormValues = {
  email: string;
  password: string;
}

export type AuthFormProps = {
  initialValues?: AuthFormValues;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  buttonText: string;
  topTitle?: string;
  bottomLink?: React.ReactNode
}

export default function AuthForm({ 
  onSubmit,
  buttonText,
  topTitle,
  bottomLink,
}: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>();
  
  const handleAuthSubmit = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      reset();
    } catch (error) {
      console.error(error)
      alert("処理に失敗しました")
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[600px] mx-auto my-10 px-2 text-left">
      <h1 className="font-bold text-xl mb-9">{topTitle}</h1>
      <form onSubmit={handleSubmit(handleAuthSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            {...register("email", {
              required: "メールアドレスを入力してください",
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            disabled={isSubmitting}
          />
        </div>

        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            {...register("password", {
              required: "パスワードを入力してください",
            })}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled={isSubmitting}
          />
        </div>

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {buttonText}
        </Button>

        {bottomLink}
      </form>
    </div>
  )
}