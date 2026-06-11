'use client'

import AuthForm, { AuthFormValues } from '../_components/AuthForm'
import { supabase } from '@/app/_libs/supabase' // 前の工程で作成したファイル
import { useRouter } from 'next/navigation'
import { Button } from '../_components/Button'

export default function Page() {
  const router = useRouter()

  const handleSubmit = async ({ email, password}: AuthFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    router.replace('/admin')
  }

  return (
    <>
      <AuthForm
        topTitle="ログイン"
        buttonText="ログイン"
        onSubmit={handleSubmit}
        bottomLink={
          <Button variant="secondary" href="/sign_up" className="block w-full">
            新規登録
          </Button>
        }
      />
    </> 
  )
}