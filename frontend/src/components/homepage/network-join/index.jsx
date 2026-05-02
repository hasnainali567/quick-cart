import React from 'react'
import GlassCard from './GlassCard'
import { BsShop } from 'react-icons/bs'
import { FaArrowRight, FaMotorcycle } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Connect = () => {
    return (
        <div className='w-full h-fit p-12 space-y-12'>
            <div className='w-full flex flex-col items-center gap-2'>
                <h4 className='text-text-primary text-3xl font-semibold'>Join the QuickCart Network</h4>
                <p className='text-text-secondary font-medium'>Grow your bussiness and earn on your own schedule.</p>
            </div>
            <div className='w-full flex gap-4 items-center'>
                <GlassCard
                    className={'w-full bg-white/30 rounded-[20px] shadow-lg shadow-white/10 backdrop-blur-3xl p-6 py-10'}
                    icon={<span className='p-4 bg-on-suface-green/50 border border-on-suface-green/70 shadow-md shadow-on-suface-green/30 w-fit rounded-[20px]'><BsShop size={28} color='var(--accent)' /></span>} >
                    <div className='space-y-4'>
                        <h5 className='text-text-primary text-3xl font-semibold'>Grow your Bussiness with <br />QuickCart</h5>
                        <p className='text-text-secondary text-base '>Join hundreds of local stores and thousand of new costumers in your area with our intgerated platform.</p>
                        <div>
                            <Button className={'w-fit bg-linear-to-r from-accent to-accent-light rounded-full p-5.5 px-8 shadow-accent/50 shadow-md'} asChild>
                                <Link href={'/store/create'} className='flex items-center gap-2 text-lg'>
                                    Register your Store
                                    <FaArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard
                    className={'w-full h-full bg-white/30 rounded-[20px] shadow-lg shadow-white/10 backdrop-blur-3xl p-6 py-10'}
                    icon={<span className='p-4 bg-accent-orange/20 border border-accent-orange/40 shadow-md shadow-accent-orange/30 w-fit rounded-[20px]'><FaMotorcycle size={28} color='var(--accent-orange)' /></span>} >
                    <div className='space-y-4'>
                        <h5 className='text-text-primary text-3xl font-semibold'>Flexible work, Fast Earning</h5>
                        <p className='text-text-secondary text-base '>Become a delivery partner and enjoy the freedom to work whenever you want, with instant payouts</p>
                        <div>
                            <Button className={'w-fit bg-linear-to-r from-accent-orange-dark to-accent-orange rounded-full p-5.5 px-8 shadow-md shadow-accent-orange/50'} asChild>
                                <Link href={'/driver/register'} className='flex items-center gap-2 text-lg'>
                                    Start Delivering
                                    <FaArrowRight />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}

export default Connect