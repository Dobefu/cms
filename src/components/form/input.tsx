import { cn } from '@/utils/cn'
import React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    let typeClasses = ''

    switch (type) {
      case 'button':
      case 'submit':
        typeClasses =
          'text-white bg-blue-600 dark:bg-blue-700 dark:not-disabled:hover:bg-blue-600 font-medium not-disabled:hover:bg-blue-700 outline-offset-4 not-disabled:cursor-pointer transition-colors dark:not-disabled:active:bg-blue-800 not-disabled:active:bg-blue-800'
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
