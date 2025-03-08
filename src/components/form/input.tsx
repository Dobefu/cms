import { cn } from '@/utils/cn'
import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          'w-full rounded-lg border border-zinc-200 px-3 py-2.5 shadow-xs dark:border-zinc-600 dark:bg-zinc-950',
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
