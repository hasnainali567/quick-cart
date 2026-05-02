import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { FaBasketShopping, FaLocationDot } from 'react-icons/fa6'

const Header = async () => {

    const session = await getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    console.log(session.data);


    return (
        <header className='p-4 xl:px-16 flex items-center justify-between'>
            <h5 className='text-lg font-bold text-accent'>QuickCart</h5>
            {session.data ?
                (
                    <div className='flex items-center gap-4'>
                        <Link href={'/profile'} className='p-2 rounded-full text-accent bg-on-suface-green'>
                            <FaLocationDot />
                        </Link>
                        <Link href={'/cart'} className='p-2 rounded-full text-accent bg-on-suface-green'>
                            <FaBasketShopping />
                        </Link>
                        <Avatar >
                            <Link href={'/profile'}>
                                <AvatarFallback className={'text-accent font-bold bg-on-suface-green'}>
                                    {session.data?.user.name.slice(0, 1)}
                                </AvatarFallback>
                            </Link>
                            <AvatarImage >
                                <Link href={'/profile'}>
                                    {session.data?.user.name.slice(0, 1)}
                                </Link>
                            </AvatarImage>
                            <AvatarBadge className={'top-0 right-0 bg-accent border-surface'} />
                        </Avatar>
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