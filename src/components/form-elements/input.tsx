import { cn } from '@/utils/cn'
import { Icon, IconifyIcon } from '@iconify/react/dist/iconify.js'
import React from 'react'

type InputProps = React.ComponentProps<'input'> &
  Readonly<{
    icon?: IconifyIcon | string
  }>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    if ((type === 'button' || type === 'submit') && icon) {
      return (
        <div className="relative">
          <Icon
            className="pointer-events-none absolute start-5 top-3.5 size-4 shrink-0"
            icon={icon}
            ssr
          />

          <input
            className={cn('btn btn--primary ps-11', className)}
            ref={ref}
            type={type}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        className={cn(
          'rounded-lg border border-zinc-200 px-3 py-2.5 shadow-xs disabled:opacity-75 dark:border-zinc-600 dark:bg-zinc-950',
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
