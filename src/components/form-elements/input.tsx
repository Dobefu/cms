import { cn } from '@/utils/cn'
import { Icon, IconifyIcon } from '@iconify/react/dist/iconify.js'
import React from 'react'

type InputProps = React.ComponentProps<'input'> &
  Readonly<{
    icon?: IconifyIcon | string
  }>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    if (type === 'button' || type === 'submit') {
      return (
        <div className="relative">
          {icon ? (
            <Icon
              className="pointer-events-none absolute start-5 top-3.5 z-10 size-4 shrink-0 text-white"
              icon={icon}
              ssr
            />
          ) : undefined}

          <input
            className={cn(
              'btn data-icon:ps-11',
              type === 'submit' && 'btn--primary',
              className,
            )}
            data-icon={icon ? '' : undefined}
            ref={ref}
            type={type}
            {...props}
          />
        </div>
      )
    }

    if (type === 'checkbox' || type === 'radio') {
      return <input className={className} ref={ref} type={type} {...props} />
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
