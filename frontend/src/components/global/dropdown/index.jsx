import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../../ui/dropdown-menu'

const DropDown = ({ children, trigger, label }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={'focus:border-none'}>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className={'bg-white/50 backdrop-blur-md'}>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{label || 'Menu'}</DropdownMenuLabel>
                    {children}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDown