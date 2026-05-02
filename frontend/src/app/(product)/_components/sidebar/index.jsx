'use client'
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'
import { BiSolidCategory } from 'react-icons/bi'
import { RiLeafFill } from 'react-icons/ri'
import { PiOrangeFill } from 'react-icons/pi'
import { FaOpencart } from 'react-icons/fa6'
import { LuMilk } from 'react-icons/lu'


const ProductSidebar = () => {

    const items = [
        {
            label: 'All Products',
            icon: <BiSolidCategory />,
            href: '/products'
        },
        {
            label: 'Vegetables',
            icon: <RiLeafFill />,
            href: '/products/vegetables'

        },
        {
            label: 'Fruits',
            icon: <PiOrangeFill />,
            href: '/products/fruits'
        },
        {
            label: 'Dairy',
            icon: <LuMilk />,
            href: '/products/dairy'
        }
    ]

    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';


    return (
        <Sidebar collapsible='icon' className={'w-64 max-w-64 bg-surface!'}>
            <SidebarContent className='rounded-lg bg-surface! p-2'>
                <SidebarHeader className={'text-accent text-lg font-semibold flex items-center gap-2'}>
                    <div className='flex items-center gap-4'>
                        <span className='p-2 rounded-2xl bg-on-suface-green '>
                            <FaOpencart size={24} />
                        </span>
                        <div className={`flex flex-col ${isCollapsed ? 'hidden' : 'block'} transition-all duration-500`}>
                            <span className='text-xl font-semibold'>
                                QuickCart
                            </span>
                            <span className='text-xs font-light text-text-secondary'>
                                Fresh groceries delivered fast!
                            </span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarGroup className={'p-0'}>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>
                            Categories
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={item.label + index}>
                                    <SidebarMenuButton asChild className={'text-text-primary hover:text-accent hover:bg-on-suface-green'}>
                                        <Link className='flex items-center gap-2' href={item.href}>
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {/* <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link className='flex items-center gap-2' href={'/products/vegetables'}>
                                        <RiLeafFill />
                                        Vegetables
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link className='flex items-center gap-2' href={'/products/fruits'}>
                                        <PiOrangeFill />
                                        Fruits
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link className='flex items-center gap-2' href={'/products/dairy'}>
                                        <LuMilk />
                                        Dairy
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default ProductSidebar