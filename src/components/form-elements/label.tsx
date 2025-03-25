import { cn } from '@/utils/cn'

export type Props = Readonly<{
  children: React.ReactNode
  className?: string
  form?: string
  htmlFor?: string
}>

export default function Label({ children, className, form, htmlFor }: Props) {
  return (
    <label
      className={cn(
        'flex flex-col gap-2 font-medium text-zinc-700 dark:text-zinc-200',
        className,
      )}
      form={form}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
