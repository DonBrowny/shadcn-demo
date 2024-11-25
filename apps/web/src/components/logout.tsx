import React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@shadcn-demo/core-ui/components/ui/button'

export const Logout = () => {
  return <Button onClick={() => signOut()}>Logout</Button>
}
