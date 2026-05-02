import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { FaBasketShopping, FaLocationDot, FaMagnifyingGlass } from 'react-icons/fa6'
import AvatarDropdown from './avatar-dropdown'
import { SidebarTrigger } from '@/components/ui/sidebar'
import InputGroup from '@/components/global/input-group'

const Header = async () => {

    const session = await getSession({
        fetchOptions: {
            headers: await headers()
        }
    }) || null


    return (
        <header className='p-4 py-2 flex items-center justify-between sticky top-0 z-50 bg-surface border-b border-[#DDE5D9]'>
            <div className='flex items-center gap-4'>
                <SidebarTrigger className={'text-accent hover:bg-on-suface-green hover:text-accent cursor-pointer'} />
                <InputGroup placeholder='Search for products...' addon={<FaMagnifyingGlass className='text-accent' />} type={'text'} className={'w-80 placeholder:text-on-suface-green'} />
            </div>
            {session.data ?
                (
                    <div className='flex items-center gap-4'>
                        <Link href={'/profile'} className='p-2 rounded-full text-accent bg-on-suface-green'>
                            <FaLocationDot />
                        </Link>
                        <Link href={'/cart'} className='p-2 rounded-full text-accent bg-on-suface-green'>
                            <FaBasketShopping />
                        </Link>
                        <AvatarDropdown user={session.data.user} />
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