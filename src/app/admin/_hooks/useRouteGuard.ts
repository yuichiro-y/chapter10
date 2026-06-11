import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useRouteGuard = () => {
  const router = useRouter()
  const { session, isLoading } = useSupabaseSession()

  useEffect(() => {
    if (isLoading) return

    if (session === null) {
      router.replace('/sign_in')
    }
  }, [router, isLoading, session])

  return { session, isLoading }
}