import React from 'react'
import RegisterForm from '../_components/registerForm'

const Register = () => {
    // const { data } = useSession();

    // if(data && data.session) {
    //     redirect('/')
    // }

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-full mt-10 gap-6'>
            <div className='flex flex-col gap-1 items-center'>
                <h2 className='text-3xl font-semibold'>Create an Account</h2>
                <p className='text-black/50 text-wrap'>Please enter your details to create an account</p>
            </div>
            <RegisterForm />
        </div>
    )
}

export default Register