import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

const GlassCard = ({title, icon, children, className}) => {
  return (
    <Card className={cn('', className)}>
        <CardHeader>
            {icon}
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
  )
}

export default GlassCard