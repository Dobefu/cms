export type Props = Readonly<{
  children: React.ReactNode
}>

export default function TitleContainer({ children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between">
      {children}
    </div>
  )
}
