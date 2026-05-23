"use client"

import React, { useState } from "react";
import { Button } from "./Button";

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
  initialValues = { email: '', password: '' }, 
  onSubmit,
  buttonText,
  topTitle,
  bottomLink,
}: AuthFormProps) {
  const [email, setEmail] = useState(initialValues.email);
  const [password, setPassword] = useState(initialValues.password);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmit({ email, password });
    } catch {
      setErrorMessage('認証に失敗しました。メールアドレスまたはパスワードを確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-10 px-2 text-left">
      <h1 className="font-bold text-xl mb-9">{topTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {buttonText}
        </Button>

        {bottomLink}
      </form>
    </div>
  )
}