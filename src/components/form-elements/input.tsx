import { cn } from '@/utils/cn'
import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    let typeClasses = ''

    switch (type) {
      case 'button':
      case 'submit':
        typeClasses = 'btn btn--primary'
        break
      default:
        typeClasses =
          'dark:border-zinc-600 dark:bg-zinc-950 border border-zinc-200'
        break
    }

    return (
      <input
        className={cn(
          'rounded-lg px-3 py-2.5 shadow-xs disabled:opacity-75',
          typeClasses,
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
