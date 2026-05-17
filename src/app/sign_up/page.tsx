'use client'

import AuthForm, { AuthFormValues } from '../_components/AuthForm'
import { supabase } from '@/app/_libs/supabase' // 前の工程で作成したファイル

export default function Page() {
  const handleSubmit = async ({ email, password}: AuthFormValues) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/sign_in',
      },
    })

    if (error) {
      alert('登録に失敗しました')
      return
    }

    alert('確認メールを送信しました')
  }

  return (
    <>
      <AuthForm
        buttonText="登録"
        onSubmit={handleSubmit}
      />
    </> 
  )
}