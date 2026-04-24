// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

type ClientResponse<T> = {
  status: number
  data: T
  headers: Headers
  url: string
}

export async function client<T>(
  endpoint: string,
  { body, ...customConfig }: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<ClientResponse<T>> {
  const headers = new Headers(customConfig.headers)
  headers.set('Content-Type', 'application/json')

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data: T | undefined
  try {
    const response = await window.fetch(endpoint, config)
    data = (await response.json()) as T
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(data ?? 'Request failed')
    return Promise.reject(new Error(message))
  }
}

client.get = function <T>(endpoint: string, customConfig: Omit<RequestInit, 'body'> = {}) {
  return client<T>(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function <T>(endpoint: string, body: unknown, customConfig: Omit<RequestInit, 'body'> = {}) {
  return client<T>(endpoint, { ...customConfig, body })
}
