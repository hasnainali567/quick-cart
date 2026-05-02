import React from 'react'
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const Select = ({
    options = [],
    placeholder = 'Select an option',
    triggerClassName,
    contentClassName,
    className,
    selectLabel,
    ...props
}) => {
    return (
        <ShadcnSelect {...props}>
            <SelectTrigger className={cn(triggerClassName)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn(className, contentClassName)}>
                <SelectGroup>

                    <SelectLabel>{selectLabel}</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </ShadcnSelect>
    )
}

export default Select
