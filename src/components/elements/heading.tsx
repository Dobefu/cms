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
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  let classes = ''

  switch (level) {
    case 1:
      classes = 'text-4xl'
      break
    case 2:
      classes = 'text-3xl'
      break
    case 3:
      classes = 'text-2xl'
      break
    case 4:
      classes = 'text-xl'
      break
    case 5:
      classes = 'text-lg'
      break
    case 6:
      classes = 'text-md'
      break
  }

  return <Tag className={cn('font-medium', classes, className)}>{children}</Tag>
}
