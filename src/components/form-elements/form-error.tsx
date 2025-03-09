export type Props = Readonly<{
  children: React.ReactNode
}>

export default function FormError({ children }: Props) {
  return <p className="font-medium text-red-500">{children}</p>
}
