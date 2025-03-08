import { QueryClient } from '@tanstack/react-query'

function getQueryClient(staleTime = 0) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
      },
    },
  })
}

export { getQueryClient }
