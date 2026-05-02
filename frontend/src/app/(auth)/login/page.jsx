import React from 'react'
import LoginFrom from '../_components/login-form'

const Login = () => {
    // const { data } = useSession();

    // if(data && data.session) {
    //     redirect('/')
    // }

    return (
        <div className='w-full flex flex-col items-center justify-center h-full gap-6 p-8'>
            <div className='flex flex-col gap-1 items-center'>
                <h2 className='text-3xl text-text-primary font-semibold text-center'>Welcome Back</h2>
                <p className='text-text-secondary text-wrap text-center'>Please enter you detailes to access your fresh grocery</p>
            </div>
            <LoginFrom />
        </div>
    )
}

export default Login