import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='h-screen w-full flex flex-col bg-muted'>
        <header>Header</header>
        <main className='flex'>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout