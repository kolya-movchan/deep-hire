import axios from "axios"
import { getToken } from "@/hooks/auth/auth"

// Base API instance for other endpoints
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/slug`,
  //   withCredentials: true,
})

// Utility functions for API calls
const get = async <T>(url: string, params = {}) => {
  try {
    const token = await getToken()
    if (!token) {
      throw new Error("Unable to get authentication token")
    }

    const response = await api.get<T>(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`GET ${url} failed:`, error)
    throw error
  }
}

const post = async <T>(url: string, data = {}, headers = {}): Promise<T> => {
  try {
    const token = await getToken()
    if (!token) {
      throw new Error("Unable to get authentication token")
    }

    const response = await api.post<T>(url, data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`POST ${url} succeeded:`, response.data)
    return response.data
  } catch (error) {
    console.error(`POST ${url} failed:`, error)
    throw error
  }
}

const deleteRequest = async <T>(url: string): Promise<T> => {
  try {
    const token = await getToken()
    if (!token) {
      throw new Error("Unable to get authentication token")
    }

    const response = await api.delete<T>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(`DELETE ${url} succeeded:`, response.data)
    return response.data
  } catch (error) {
    console.error(`DELETE ${url} failed:`, error)
    throw error
  }
}

// API Endpoints
const apiEndpoints = {
  getUserData: () => get<unknown>("/user-data"),
  postUserData: () => post<unknown>("/user-data"),
  deleteUserData: () => deleteRequest<unknown>("/user-data"),
  // sendMessage: (chatId: string, content: string) =>
  //   post<unknown>(`/${chatId}/messages`, { content }),
  // getAllMessages: (chatId: string) => get<unknown>(`/${chatId}/messages`),
  // getAllChats: () => get<unknown>("/chats"),
}

export default apiEndpoints
