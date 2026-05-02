'use client'
import InputGroup from '@/components/global/input-group'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaMapPin, FaStore, FaUser } from 'react-icons/fa6'

const CreateForm = ({ user }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: user?.email,
            contactName: user?.name
        }
    })
    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
            <Field>
                <FieldLabel className={'text-text-secondary'}>Name</FieldLabel>
                <InputGroup addon={<FaStore />} placeholder={'e.g. My Store'} register={register('name')} type={'text'} />
            </Field>
            <Field>
                <FieldLabel className={'text-text-secondary'}>Store Address</FieldLabel>
                <InputGroup addon={<FaMapPin />} placeholder={'e.g. 123 Main Street Karachi pakistan'} register={register('addressLine1')} type={'text'} />
            </Field>
            <Field>
                <FieldLabel className={'text-text-secondary'}>Email</FieldLabel>
                <InputGroup addon={<FaEnvelope />} disabled={true} register={register('email')} type={'email'} />
            </Field>
            <Field>
                <FieldLabel className={'text-text-secondary'}>Contact Name</FieldLabel>
                <InputGroup addon={<FaUser />} disabled={true} register={register('contactName')} type={'text'} />
            </Field>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Field>
                    <FieldLabel className={'text-text-secondary'}>Latitude</FieldLabel>
                    <InputGroup addon={<FaUser />} placeholder={'e.g. 24.8607'} register={register('latitude', {
                        required: 'Latitude is required',
                        pattern: {
                            value: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
                            message: 'Invalid latitude format'
                        }
                    })} type={'text'} />
                </Field>
                <Field>
                    <FieldLabel className={'text-text-secondary'}>Longitude</FieldLabel>
                    <InputGroup addon={<FaUser />} placeholder={'e.g. 67.0056'} register={register('longitude', {
                        required: 'Longitude is required',
                        pattern: {
                            value: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
                            message: 'Invalid longitude format'
                        }
                    })} type={'text'} />
                </Field>
            </div>
            <Field>
                <FieldLabel className={'text-text-secondary'}>City</FieldLabel>
                <InputGroup addon={<FaUser />} placeholder={'e.g. Karachi'} register={register('city',
                    {
                        required: 'City is required',
                        pattern: {
                            value: /^[a-zA-Z\s]+$/,
                            message: 'City can only contain letters and spaces'
                        }
                    }
                )} type={'text'} />
            </Field>
            <Field>
                <FieldLabel className={'text-text-secondary'}>Area</FieldLabel>

                <InputGroup addon={<FaUser />} placeholder={'e.g. Gulshan-e-Iqbal'} register={register('area',
                    {
                        required: 'Area is required',
                    }
                )} type={'text'} />
            </Field>
            <Button type='submit' className='w-full mt-4 bg-accent hover:bg-accent/80 '>Create Store</Button>
        </form>
    )
}

export default CreateForm