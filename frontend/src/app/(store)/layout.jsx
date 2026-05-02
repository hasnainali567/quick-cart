import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const StoreLayout = async ({ children }) => {
  let session = null;

  try {
    session = await getSession({
      fetchOptions: { headers: await headers() }
    })
  } catch (error) {
    console.log(error);
    session = null
  }

  // if (!session || !session.data || !session.data?.user) {
  //   return redirect('/')
  // }

  // if (!session || !session.data.user?.role === 'STORE_ADMIN') {
  //   redirect('/mystore')
  // }


  return (
    <main className='min-h-full h-screen w-full bg-surface overflow-hidden'>
      {children}
    </main>
  )
}

export default StoreLayout