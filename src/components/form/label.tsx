export type Props = Readonly<{
  children: React.ReactNode
  form?: string | undefined
  htmlFor?: string | undefined
}>

export default function Label({ children, form, htmlFor }: Props) {
  return (
    <label
      className="flex flex-col gap-2 font-medium text-zinc-700 dark:text-zinc-200"
      form={form}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  )
}
