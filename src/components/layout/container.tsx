import { cn } from '@/utils/cn'

export type Props = Readonly<{
  children: React.ReactNode
  className?: string
}>

export default function Container({ children, className }: Props) {
  return (
    <div
      className={cn(
        'w-full rounded-lg border border-zinc-300 bg-white p-4 shadow-xs dark:border-zinc-600 dark:bg-zinc-900',
        className,
      )}
    >
      {children}
    </div>
  )
}
