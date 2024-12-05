'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@shadcn-demo/data-provider/store'
import { setScopes } from '@shadcn-demo/data-provider/lib/scopes-slice'

export function ReduxProvider({ children, scopes }: { children: React.ReactNode; scopes: string[] }) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
    storeRef.current.dispatch(setScopes(scopes))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
