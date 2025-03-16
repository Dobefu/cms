export type Props = Readonly<{
  children: React.ReactNode
}>

export default function TitleContainer({ children }: Props) {
  return (
    <div className="flex min-h-11 flex-wrap items-center justify-between">
      {children}
    </div>
  )
}
