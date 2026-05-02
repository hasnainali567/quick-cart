import GlassBadge from '@/components/global/glass-badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Cart, Scooter } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import Header from '@/components/global/header'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'


const AuthLayout = async ({ children }) => {

    let session = null;
    try {
        session = await getSession({
            fetchOptions: { headers: await headers() }
        })
    } catch (error) {
        console.log(error);
        session = null
    }

    return (
        <div className='h-screen w-full overflow-hidden'>
            <main className='flex h-full w-full'>
                <div className='h-full hidden md:flex flex-col bg-accent p-8 px-12 w-[45%] max-w-lg text-white'>
                    <Link href={'/'} className=''>
                    <div className='flex gap-2 items-center'>
                        <HugeiconsIcon icon={Cart} color='white' size={32} />
                        <h3 className='text-xl leading-tight font-medium italic'>QuickCart</h3>
                    </div>
                    </Link>
                    <div className='w-full flex-1 flex flex-col'>
                        <div className='w-full flex-1 content-center rounded-md p-2 lg:p-10'>
                            <div className='aspect-square w-full bg-accent-orange rounded-4xl relative'>
                                <Image
                                    width={500}
                                    height={500}
                                    alt={'banner'}
                                    src={'https://lh3.googleusercontent.com/aida-public/AB6AXuARvctOro91ujkVurIPK53imswN_DFvt-8tac7KgPdSScr4UWHCIX2exuXpIwZZjDPp6mUSgbF7GtsXJGRmTNtREDzJYdNJzgVe5OMIxyC_FxYIrm7tjHzYOwQLBSdRDAKxjFbuu2_H0t09_VV_teEn8JUeg74H1h9nPnRBeeSYhpc1ixSCzqpz7Q34LIeJQVwFq3eStzcT6feVIFSi2P3_CurNmHWvpFcNOZD4mFUjG4pWs_z0pZumZqAJJh6jyvjCc_XY0I6zykI'}
                                    className='w-full h-full object-cover rounded-4xl overflow-hidden'
                                />
                                <GlassBadge
                                    className={'p-2 absolute -top-10 -right-8'}
                                    icon={
                                        <span className='p-2  aspect-square rounded-full bg-on-suface-green/70'>
                                            <HugeiconsIcon icon={Scooter} color={'var(--accent)'} />
                                        </span>
                                    }
                                    label={'SPEED'}
                                    title={'25 min Delivery'}
                                />
                                <GlassBadge
                                    className={'p-2 absolute bottom-16 -left-12'}
                                    icon={
                                        <span className='p-2 rounded-full bg-on-suface-green/70'>
                                            <HugeiconsIcon icon={Scooter} color={'var(--accent)'} />
                                        </span>
                                    }
                                    label={'Truster'}
                                    title={'4.8 rating'}
                                />
                                <GlassBadge
                                    className={'p-2 absolute -bottom-10 right-4'}
                                    icon={
                                        <span className='p-2 rounded-full bg-on-suface-green/70'>
                                            <HugeiconsIcon icon={Scooter} color={'var(--accent)'} />
                                        </span>
                                    }
                                    label={'Variety'}
                                    title={'1000+ products'}
                                />

                            </div>
                            <div className='text-3xl font-bold text-center pt-10'>
                                <h2>Fresh grocery at <br /> your Doorstep</h2>
                            </div>
                        </div>
                    </div>
                    <Separator className={'h-px bg-white/20'} />
                    <div className='flex items-center'>
                        <div className='flex flex-col items-center pt-6 w-full'>
                            <h5 className='text-lg font-medium'>50+</h5>
                            <span className='font-extralight text-sm text-white/50'>STORES</span>
                        </div>
                        <Separator orientation='vertical' className={'h-1/3 my-auto bg-white/20'} />
                        <div className='flex flex-col items-center pt-6 w-full'>
                            <h5 className='text-lg font-medium'>500+</h5>
                            <span className='font-extralight text-sm text-white/50'>PRODUCTS</span>
                        </div>
                        <Separator orientation='vertical' className={'h-1/3 my-auto bg-white/20'} />
                        <div className='flex flex-col items-center pt-6 w-full'>
                            <h5 className='text-lg font-medium'>30 min</h5>
                            <span className='font-extralight text-sm text-white/50'>DELIVERY</span>
                        </div>
                    </div>
                </div>
                <div className='w-full flex-1 flex flex-col items-center gap-8 pt-12 overflow-y-auto'>
                    <Tabs>
                        <TabsList className={'bg-on-surface text-muted rounded-full '}>
                            <TabsTrigger value={'login'} className='data-[state=active]:bg-white data-[state=active]:text-accent w-24 rounded-full'><Link href='/login'>Login</Link></TabsTrigger>
                            <TabsTrigger value={'register'} className='data-[state=active]:bg-white data-[state=active]:text-accent w-24 rounded-full'><Link href='/register'>Register</Link></TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default AuthLayout