import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { FaBasketShopping, FaLocationDot } from 'react-icons/fa6'
import DropDown from '../dropdown'
import { Store, User } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'



const Header = async ({ user }) => {
  return (
    <header className='p-2 xl:px-16 flex items-center justify-between bg-on-suface-green/60'>
      <div className='flex items-center gap-4'>
        <h5 className='text-xl font-bold text-accent'>QuickCart</h5>
        <div className='flex items-center gap-2 text-sm text-text-secondary'>
          <Link href={'/products'}>
            Explore
          </Link>
          <Link href={'/products/vegetables'}>
            Vegetables
          </Link>
          <Link href={'/products/fruits'}>
            Fruits
          </Link>
        </div>
      </div>
      {user ?
        (
          <div className='flex items-center gap-4'>
            <Link href={'/profile'} className='p-2 rounded-full text-accent bg-on-suface-green'>
              <FaLocationDot />
            </Link>
            <Link href={'/cart'} className='p-2 rounded-full text-accent bg-on-suface-green'>
              <FaBasketShopping />
            </Link>
            <DropDown label={'Menu'} trigger={
              <Avatar className={'cursor-pointer'} >
                <AvatarFallback className={'text-accent font-bold bg-on-suface-green'}>
                  {user?.name?.slice(0, 1)}
                </AvatarFallback>
                <AvatarImage src={user?.image} >
                </AvatarImage>
                <AvatarBadge className={'top-0 right-0 bg-accent border-surface'} />
              </Avatar>
            }>
              <Link href={'/profile'}>
              <DropdownMenuItem className={'hover:bg-on-suface-green! hover:text-text-primary! cursor-pointer'}>
                <HugeiconsIcon icon={User} />
                Profile
              </DropdownMenuItem>
              </Link>
              {user && user.role !== 'CUSTOMER' && (
                <Link href={'/mystore'} >
                  <DropdownMenuItem className={'hover:bg-on-suface-green! hover:text-text-primary! cursor-pointer'}>
                    <HugeiconsIcon icon={Store} />
                    Store
                  </DropdownMenuItem>
                </Link>
              )}
            </DropDown>

          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Button asChild variant='outline' className={'hover:bg-on-suface-green p-5 px-8 cursor-pointer rounded-full'}>
              <Link href={'/login'}>
                Login
              </Link>
            </Button>
            <Button asChild className={'bg-accent hover:bg-accent p-5 px-8 cursor-pointer rounded-full'}>
              <Link href={'/register'}>
                Register
              </Link>
            </Button>
          </div>
        )}
    </header>
  )
}

export default Header