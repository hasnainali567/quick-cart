'use client'
import InputGroup from '@/components/global/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { signIn } from '@/lib/auth'
import { Alert, Facebook, GoogleIcon, Lock, Mail, User } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { LockIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa6'
import { GoAlertFill } from 'react-icons/go'

const LoginFrom = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        console.log(data)

        const res = await signIn.email({
            email: data.email,
            password: data.password,
            fetchOptions: {
                onError: (err) => {
                    console.log(err);
                },
                onSuccess: (data) => {
                    console.log(data);
                }
            }
        })
    }

    return (
        <div className='w-full max-w-md pb-20'>
            <div className='w-full grid grid-cols-2 items-center gap-4'>
                <Button variant='outline' className={'w-full hover:bg-on-suface-green bg-transparent transition-colors duration-100 cursor-pointer'}>
                    <HugeiconsIcon color={'var-(--text-secondary)'} icon={GoogleIcon} />
                    Google
                </Button>
                <Button variant='outline' className={'w-full hover:bg-on-suface-green bg-transparent transition-colors duration-100 cursor-pointer'}>
                    <HugeiconsIcon color={'var-(--text-secondary)'} icon={Facebook} />
                    Facebook
                </Button>
            </div>
            <div className='flex items-center w-full gap-2 py-6'>
                <Separator className={'shrink h-px'} />
                <span className='text-nowrap text-xs text-black/30'>
                    OR CONTINUE WITH EMAIL
                </span>
                <Separator className={'shrink h-px'} />
            </div>



            <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-2'>
                <Field className={'gap-1'}>
                    <FieldLabel className={'text-black/80'}>Email</FieldLabel>
                    <InputGroup
                        addon={<FaEnvelope />}
                        placeholder='Enter your email'
                        register={register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    <FieldDescription>
                        {errors.email && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span>{errors.email.message}</span>
                            </div>
                        )}
                    </FieldDescription>
                </Field>
                <Field className={'gap-1'}>
                    <FieldLabel className={'text-black/80'}>Password</FieldLabel>
                    <InputGroup
                        addon={<FaLock />}
                        placeholder='Enter your password'
                        register={register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters long'
                            }
                        })}
                        type='password'
                    />
                    <FieldDescription>
                        {errors.password && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span>{errors.password.message}</span>
                            </div>
                        )}
                    </FieldDescription>
                </Field>
                <Button className={'w-full rounded-full bg-linear-to-r from-accent to-accent-light py-5 text-base font-medium text-white shadow-on-surface shadow-md mt-4'}>
                    Login to your account
                </Button>
            </form>
            <div className='text-sm text-center text-black/50 mt-4'>
                Don&apos;t have an account? <Link href='/register' className='text-accent hover:underline'>Register</Link>
            </div>
        </div>
    )
}

export default LoginFrom