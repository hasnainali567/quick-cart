import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import Link from 'next/link'
import { BiSolidCategory } from 'react-icons/bi'
import { RiLeafFill } from 'react-icons/ri'
import { PiOrangeFill } from 'react-icons/pi'

const ProductListLayout = ({ children }) => {
    return (
        <main className='h-full w-full flex bg-surface'>
            <div className='p-4'>
                {children}
            </div>
        </main>
    )
}

export default ProductListLayout