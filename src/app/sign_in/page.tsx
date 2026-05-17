'use client'

import AuthForm, { AuthFormValues } from '../_components/AuthForm'
import { supabase } from '@/app/_libs/supabase' // 前の工程で作成したファイル
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  const handleSubmit = async ({ email, password}: AuthFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('ログインに失敗しました')
      return
    }

    router.replace('/admin')
  }

  return (
    <>
      <AuthForm
        buttonText="ログイン"
        onSubmit={handleSubmit}
        bottomLink={
          <Link href="/sign_up"
            className="block w-full text-center rounded-lg border focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2 hover:bg-gray-100"
          >
            新規登録
          </Link>
        }
      />
    </> 
  )
}