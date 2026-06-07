'use client'

import AuthForm, { AuthFormValues } from '../_components/AuthForm'
import { supabase } from '@/app/_libs/supabase' // 前の工程で作成したファイル
import { Button } from '../_components/Button'

export default function Page() {
  const handleSubmit = async ({ email, password}: AuthFormValues) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/sign_in`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    alert('確認メールを送信しました')
  }

  return (
    <>
      <AuthForm
        topTitle="新規登録"
        buttonText="登録"
        onSubmit={handleSubmit}
        bottomLink={
          <Button variant="secondary" href="/sign_in" className="block w-full">
            戻る
          </Button>
        }        
      />
    </> 
  )
}