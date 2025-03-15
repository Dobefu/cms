import Heading from '@/components/elements/heading'
import Footer from '@/components/layout/footer'

export default function NotFound() {
  return (
    <>
      <main
        className="flex flex-1 flex-col gap-4 bg-zinc-100 p-4 shadow-inner dark:bg-zinc-700"
        id="main-content"
      >
        <div className="flex flex-col gap-4">
          <Heading level={1}>404</Heading>
          <p>This page could not be found.</p>
        </div>
      </main>

      <Footer />
    </>
  )
}
