import axios from "axios"

// Base API instance for other endpoints
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/slug`,
  //   withCredentials: true,
})

// Utility functions for API calls
const get = async <T>(url: string, params = {}) => {
  try {
    const response = await api.get<T>(url, {
      params,
    })
    return response.data
  } catch (error) {
    console.error(`GET ${url} failed:`, error)
    throw error
  }
}

const post = async <T>(url: string, data = {}, headers = {}): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, { headers })
    console.log(`POST ${url} succeeded:`, response.data)
    return response.data
  } catch (error) {
    console.error(`POST ${url} failed:`, error)
    throw error
  }
}

// API Endpoints
const apiEndpoints = {
  sendMessage: (chatId: string, content: string) =>
    post<unknown>(`/${chatId}/messages`, { content }),
  getAllMessages: (chatId: string) => get<unknown>(`/${chatId}/messages`),
  getAllChats: () => get<unknown>("/chats"),
}

export default apiEndpoints
