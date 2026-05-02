import React from 'react'
import Header from './_components/header'
import Footer from './_components/footer'
import { FaTruck } from 'react-icons/fa6'
import { SidebarProvider } from '@/components/ui/sidebar'
import ProductSidebar from './_components/sidebar'

const ProductLayout = ({ children }) => {
    return (
        <SidebarProvider>
            <div className='bg-surface h-screen w-full flex'>
                <ProductSidebar />
                <div className='flex flex-col flex-1 w-full h-full'>

                    <Header />
                    {/* free delivery banner */}
                    <div className='bg-accent p-1 text-center text-sm font-medium text-white flex items-center justify-center gap-2 uppercase'>
                        <FaTruck />
                        Free delivery on orders on $50 on above in karachi!
                    </div>
                    <main className='flex-1 h-full w-full '>
                        {children}
                    </main>
                    <Footer />
                </div>
            </div >
        </SidebarProvider >
    )
}

export default ProductLayout