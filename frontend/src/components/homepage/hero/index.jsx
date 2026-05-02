import GlassBadge from '@/components/global/glass-badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { FaStopwatch } from 'react-icons/fa6'
import { MdOutlinePercent } from 'react-icons/md'
import { RiLeafFill } from 'react-icons/ri'
import { FiShoppingBag } from "react-icons/fi";
import BANNER1 from '../../../../public/banner1.jpg'
import BANNER2 from '../../../../public/banner2.jpg'
import Link from 'next/link'

const Hero = () => {
    return (
        <div className='bg-on-surface w-full flex p-8 py-10 xl:p-16  min-h-fit gap-2'>
            <div className='flex flex-col space-y-10 w-fit shrink-0 py-6'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-5xl font-bold leading-tight text-text-primary'>Fresh Groceries
                        <span className='text-accent-light/90 italic'><br />Delivered<span>.</span></span>
                    </h1>
                    <p className='text-text-secondary'>Organic products and artsinal essentials, delivered to <br />your doorstep.</p>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                    <Button asChild className={'bg-linear-to-r from-accent to-accent-light rounded-full p-6 px-8 cursor-pointer text-base font-medium'}>
                        <Link href={'/products'}>
                        Start Exploring
                        </Link>
                    </Button>
                    <GlassBadge
                        className={'rounded-full p-3 bg-white/20'}
                        icon={<FaStopwatch color='var(--accent)' size={18} />}
                        title={<span className='text-text-primary font-medium'>25 MIN DELIVERY</span>}
                    />

                </div>
                <div className='flex items-center gap-8'>
                    <span className='uppercase text-text-secondary/80 text-sm font-medium'>Trusted by local Growers</span>
                    <span className='uppercase text-text-secondary text-lg font-semibold italic'>Oragnic Union</span>
                    <span className='uppercase text-text-secondary text-lg font-semibold italic'>Green Belt</span>
                </div>
            </div>
            <div className='min-h-full w-full hidden lg:flex lg:px-6 items-center justify-end gap-4'>
                <div className='h-full w-52 shrink-0 flex items-center'>
                    <div className='bg-accent w-full rounded-[40px] h-4/5 overflow-hidden'>
                        <Image
                            width={500}
                            height={500}
                            alt={'banner'}
                            src={BANNER1}
                            className='w-full h-full object-cover rounded-4xl overflow-hidden'
                        /></div>
                </div>
                <div className='h-full w-52 shrink-0 flex flex-col gap-2'>
                    <div className='h-3/5 w-full flex items-center rounded-2xl'>
                        <div className='bg-accent h-full w-full rounded-[40px]  relative'>
                            <Image
                                width={500}
                                height={500}
                                alt={'banner'}
                                src={BANNER2}
                                className='w-full h-full object-cover rounded-[30px] overflow-hidden'
                            />
                            <GlassBadge className={'p-2 absolute -top-8 -right-12 bg-white/60 backdrop-blur-md!'} 
                            label={'SPECIAL OFFER'}
                            title={'Free Delivery over 35$'}
                            icon={<span className='p-2  rounded-full bg-accent-orange/20'><FiShoppingBag color='var(--accent-orange)' size={24} /></span>} />
                        </div>
                    </div>
                    <div className='h-2/5 w-full flex rounded-[30px] bg-accent-light p-4 flex-col gap-4'>
                        <RiLeafFill size={48} color='white' />
                        <div className='flex justify-start'>
                            <span className='inline text-xl font-bold text-white'>
                                100<MdOutlinePercent className='inline' size={24} /> Sustainably Sourced
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero