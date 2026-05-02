import Image from 'next/image'
import React from 'react'
import { FaArrowLeft, FaUsers } from 'react-icons/fa6'
import { MdOutlineSupportAgent } from 'react-icons/md'
import { PiChartLineUpBold, PiPuzzlePiece, PiPuzzlePieceFill } from 'react-icons/pi'
import CreateForm from './_components/form'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

const FEATURES = [
  {
    title: 'Grow your business',
    description: 'Tap into new revenue streams and expand your market reach.',
    icon: <PiChartLineUpBold />
  },
  {
    title: 'Reach thousands ',
    description: 'Connect with a large customer base actively seeking local products and services.',
    icon: <FaUsers /> // which icon to use here? maybe a gear or something that represents integration like
  },
  {
    title: '24/7 Support',
    description: 'Dedicated support team available around the clock to assist you with any questions or issues.',
    icon: <MdOutlineSupportAgent />
  }
]
const CreateStorePage = async () => {

  let session = null;

  try {
    session = await getSession({
      fetchOptions: { headers: await headers() }
    })
  } catch (error) {
    console.log(error);
    session = null
  }

  const user = session?.data?.user || null;
  return (
    <div className={'w-full flex h-full'}>
      <div className="w-1/2 relative min-h-100 lg:min-h-full hidden lg:block overflow-hidden">
        <Image width={500} height={1000} alt="Local Merchant" className="absolute inset-0 w-full h-full object-cover" data-alt="bright modern local grocery store interior with fresh organic produce arranged neatly on wooden shelves, warm inviting lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Gh7lJdHHuze8G0rA1cxDdKc9CQTKpEVGPDxKOz6jt9BaaPQOmEC5QEjOhQ_eTd8095O_dVgQg6-boatSYnZ5h0V5m6HJExhr9mKgfah4Cl-lnDRRVCMHrrfNrG-RvXJF0q0T8YgwexyMiudBylvpeHz6yilh_WVUaXlCmQhnkyWioRT9G-jmTNxQHW-USKlt2DCTBh4f55PakoptMP8MMWJ_CSWE9LK_9vOZP00L7wGAEdFZJARu0HVbkdGMkdTtO0JodHHqiP0" />
        <div className="absolute inset-0 bg-linear-to-t from-[#2b322b]/90 via-[#2b322b]/40 to-transparent"></div>
        <div className="absolute inset-0 p-12 flex flex-col justify-end text-on-tertiary">
          <h1 className="text-4xl md:text-4xl font-extrabold mb-6 font-display text-surface leading-tight">Partner with Botanical Gallery.</h1>
          <p className="text-base font-body text-surface/80 mb-6 max-w-md">Elevate your local business by joining our curated network of premium merchants.</p>
          <div className="space-y-4">
            {FEATURES.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="material-symbols-outlined text-on-suface-green! text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-xl font-bold font-headline text-surface">{feature.title}</h3>
                  <p className="text-surface/70 font-body text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-8 flex flex-col items-center h-full overflow-auto">
        <Link href={'/'} className='flex items-center gap-2 w-full justify-start text-accent'>
          <span className=''>
            <FaArrowLeft />
          </span>
          <h3 className='text-sm leading-tight'>Home</h3>
        </Link>
        <div className="w-full flex-1 flex flex-col justify-center max-w-md py-10">
          <h2 className="text-3xl font-bold mb-2 text-center text-text-primary">Create Your Store</h2>
          <p className="text-center mb-4 text-text-secondary">Join our platform and start reaching more customers today.</p>
          <CreateForm user={user} />
        </div>
      </div>
    </div>
  )
}

export default CreateStorePage