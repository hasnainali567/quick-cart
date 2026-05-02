import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

const GlassBadge = ({ icon, label, title, className }) => {
    return (
        <Card className={cn('bg-white/50 backdrop-blur-md w-fit h-fit', className)}>
            <div className='flex gap-2 items-center'>
                {icon}
                <div className='flex flex-col -space-y-0.5'>
                    <span className='text-black/30 text-xs'>{label}</span>
                    <span className='text-black/70 text-sm font-bold'>{title}</span>
                </div>
            </div>
        </Card>
    )
}

export default GlassBadge