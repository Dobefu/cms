import { cn } from '@/utils/cn'

export type Props = Readonly<{
  children: React.ReactNode
  className?: string
}>

export default function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        'w-full rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900',
        className,
      )}
    >
      {children}
    </div>
  )
}
