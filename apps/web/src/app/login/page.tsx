'use client'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log(status)
      void signIn('logto')
    } else if (status === 'authenticated') {
      void router.push('/')
    }
  }, [status])

  return <></>
}
