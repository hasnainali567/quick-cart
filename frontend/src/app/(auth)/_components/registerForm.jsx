'use client'
import InputGroup from '@/components/global/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { signUp } from '@/lib/auth'
import { Facebook, GoogleIcon, Lock, Mail, Phone } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaLock, FaPhone, FaUser } from 'react-icons/fa6'
import { GoAlertFill } from 'react-icons/go'

const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        console.log(data)

        const res = await signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            fetchOptions: {
                onError: (err) => {
                    console.log(err);
                },
                onSuccess: (data) => {
                    console.log(data);
                    redirect('/')
                }
            }
        })
    }


    return (
        <div className='w-full max-w-md pb-20'>
            <div className='w-full grid grid-cols-2 items-center gap-4 text-text-secondary'>
                <Button variant='outline' className={'w-full hover:bg-on-suface-green bg-transparent transition-colors duration-100 cursor-pointer'}>
                    <HugeiconsIcon icon={GoogleIcon} />
                    Google
                </Button>
                <Button variant='outline' className={'w-full hover:bg-on-suface-green bg-transparent transition-colors duration-100 cursor-pointer'}>
                    <HugeiconsIcon icon={Facebook} />
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



            <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-4'>
                <Field className={'gap-1'}>
                    <FieldLabel>Name</FieldLabel>
                    <InputGroup
                        addon={<FaUser color='var(--text-secondary)' />}
                        placeholder={'Enter Name'}
                        register={register('name', {
                            required: 'Name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters'
                            },
                            maxLength: {
                                value: 50,
                                message: 'Name cannot be more than 50 characters'
                            }
                        })}
                        type={'text'}
                        key={'name-input'}
                    />
                    <FieldDescription>
                        {errors.name && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span className=''>{errors.name.message}</span>
                            </div>
                        )}
                    </FieldDescription>
                </Field>
                <Field className={'gap-1'}>
                    <FieldLabel>Email</FieldLabel>
                    <InputGroup
                        addon={<FaEnvelope color='var(--text-secondary)' />}
                        placeholder={'Enter your email'}
                        register={register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address'
                            }
                        })}
                        type={'email'}
                        key={'email-input'}
                    />
                    <FieldDescription>
                        {errors.email && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span className=''>{errors.email.message}</span>
                            </div>
                        )}
                    </FieldDescription>
                </Field>
                <Field className={'gap-1'}>
                    <FieldLabel>Password</FieldLabel>
                    <InputGroup
                        addon={<FaLock color='var(--text-secondary)' />}
                        placeholder={'Enter your password'}
                        register={register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        type={'password'}
                        key={'password-input'}
                    />
                    <FieldDescription>
                        {errors.password && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span className=''>{errors.password.message}</span>
                            </div>
                        )}
                    </FieldDescription>
                </Field>
                <Field className={'gap-1'}>
                    <FieldLabel >Phone number</FieldLabel>
                    <div className='flex items-center gap-2'>
                        {/* // country code selector will go here */}
                        <Input disabled type="text" placeholder='+92' className='w-14 disabled:bg-on-surface disabled:text-text-secondary!' />
                        <InputGroup addon={<FaPhone color='var(--text-secondary)' />} type="tel" placeholder='Enter your phone number' {...register('phone', {
                            // required: 'Phone number is required',
                            // pattern: {
                            //     value: /^[0-9]+$/,
                            //     message: 'Invalid phone number'
                            // },
                            // maxLength: {
                            //     value: 11,
                            //     message: 'Phone number cannot be more than 11 digits'
                            // },
                            // minLength: {
                            //     value: 10,
                            //     message: 'Phone number cannot be less than 10 digits'
                            // }
                        })} />
                    </div>
                    <FieldDescription>
                        {errors.phone && (
                            <div className='flex items-center gap-1 text-red-400'>
                                <GoAlertFill />
                                <span className=''>{errors.phone.message}</span>
                            </div>
                        )}
                    </FieldDescription>

                </Field>
                <Button className={'w-full rounded-full bg-linear-to-r from-accent to-accent-light py-5 text-base font-medium text-white shadow-on-surface shadow-md mt-4'}>
                        Create Account
                </Button>
            </form>
            <div className='text-sm text-center text-black/50 mt-4'>
                Already have an account? <Link href='/login' className='text-accent hover:underline'>Login</Link>
            </div>
        </div>
    )
}

export default RegisterForm