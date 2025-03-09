function getApiEndpoint(): string | undefined {
  const apiEndpoint = process.env.API_ENDPOINT

  if (!apiEndpoint) {
    console.error('API_ENDPOINT is not set')
    return
  }

  return apiEndpoint
}

export { getApiEndpoint }
