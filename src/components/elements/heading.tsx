import { cn } from '@/utils/cn'
import { JSX } from 'react'

export type Props = Readonly<{
  children: React.ReactNode
  className?: string
  level: number
}>

export default function Heading({ children, className, level }: Props) {
  if (!level || level < 1 || level > 6) {
    console.error('Invalid tag level')
    return
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  let classes = ''

  switch (level) {
    case 1:
      classes = 'text-3xl'
      break
    case 2:
      classes = 'text-2xl'
      break
    case 3:
      classes = 'text-xl'
      break
    case 4:
      classes = 'text-lg'
      break
    case 5:
      classes = 'text-md'
      break
    case 6:
      classes = 'text-sm'
      break
  }

  return (
    <Tag
      className={cn(
        'font-medium text-gray-800 dark:text-white',
        classes,
        className,
      )}
    >
      {children}
    </Tag>
  )
}
