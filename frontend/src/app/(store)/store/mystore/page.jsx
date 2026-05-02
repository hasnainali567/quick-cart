import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const MyStorePage = async () => {

    let session = null;

    try {
        session = await getSession({
            fetchOptions: { headers: await headers() }
        })
    } catch (error) {
        console.log(error);
        session = null
    }

    if (!session || !session.data) {
        redirect('/login')
    } else if ((session || session.data) && session.data.user?.role !== 'STORE_ADMIN') {
        redirect('/store/create')
    }

    return (
        <div>MyStorePage</div>
    )
}

export default MyStorePage