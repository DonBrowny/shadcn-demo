'use client'
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@shadcn-demo/core-ui/components/ui/command'
import { Logout } from '../components/logout'

export default function Index() {
  const { data: session } = useSession()
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
          <h3 className='text-center text-xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]'>
            Nx + shadcn/ui + Next.js + Keycloak
          </h3>
        </section>

        <span className='text-center w-full inline-block mb-4'>shadcn/ui example component</span>

        <Command className='rounded-lg border shadow-md h-fit'>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <Calendar className='mr-2 h-4 w-4' />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className='mr-2 h-4 w-4' />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className='mr-2 h-4 w-4' />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Settings'>
              <CommandItem>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className='mr-2 h-4 w-4' />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  )
}
