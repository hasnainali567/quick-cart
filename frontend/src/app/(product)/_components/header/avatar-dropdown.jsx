'use client'
import DropDown from '@/components/global/dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { FaUser } from 'react-icons/fa6'
import { IoLogOut  } from 'react-icons/io5'

const AvatarDropdown = ({ user }) => {

    const handleLogout = async () => {
        try {
            const res = await signOut();

            if (res.data) {
                redirect('/login')
            }
        } catch (error) {

        }
    }


    return (
        <DropDown trigger={
            <Avatar>
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
        }>
            <>
                <Link href={'/profile'} className='w-full h-full'>
                    <DropdownMenuItem className={'hover:bg-on-suface-green! hover:text-primary! cursor-pointer'}>
                        <FaUser />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />

                <DropdownMenuItem className={'hover:bg-on-suface-green! hover:text-primary! cursor-pointer'} onClick={handleLogout}>
                    <IoLogOut  />
                    Logout
                </DropdownMenuItem>

            </>
        </DropDown>
    )
}

export default AvatarDropdown