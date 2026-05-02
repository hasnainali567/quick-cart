import React from 'react'
import { InputGroup as ShadcnInputGroup, InputGroupAddon, InputGroupInput } from '../../ui/input-group'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'

const InputGroup = ({ addon, placeholder, register, type, className, disabled }) => {
    return (
        <ShadcnInputGroup className={cn('bg-on-surface border-none focus:ring-text-secondary!', className)}>
            <InputGroupAddon>
                {addon}
            </InputGroupAddon>
            <InputGroupInput type={type || "text"} placeholder={placeholder} {...register} disabled={disabled} />
        </ShadcnInputGroup>
    )
}

export default InputGroup