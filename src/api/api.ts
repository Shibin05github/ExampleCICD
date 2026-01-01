import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000
})

// Generic GET
export const getRequest = <T>(endpoint: string) => {
  return api.get<T>(endpoint)
}

// Generic POST
export const postRequest = <T, B = unknown>(
  endpoint: string,
  body: B
) => {
  return api.post<T>(endpoint, body)
}

export default api
