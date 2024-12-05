'use client'
import { useSession } from 'next-auth/react'
import { Logout } from '../components/logout'
import { scopesHook } from '@shadcn-demo/data-provider/lib/scopes-hook'

export default function Index() {
  const { data: session } = useSession()
  const { getScopes } = scopesHook
  const scopes = getScopes()
  console.log(session)
  if (!session?.user) {
    return null
  }
  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='max-w-md w-full'>
        <section className='mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20'>
          <span className='inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium'>
            🎉{' '}
            <div
              data-orientation='vertical'
              role='none'
              className='shrink-0 bg-border w-[1px] mx-2 h-4'
            ></div>{' '}
            <span className='inline'>{`Welcome, ${session?.user.name}`}</span>
          </span>
          <Logout />
        </section>

        <span className='text-center w-full inline-block mb-4'>Roles : {session.user.roles.toString()}</span>
        <span className='text-center w-full inline-block mb-4'>Permissions : {scopes.toString()}</span>
      </div>
    </div>
  )
}
