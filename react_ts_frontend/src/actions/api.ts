import axios, { AxiosResponse } from "axios";
import { Book } from "../interfaces/book.ts";
import { User } from "../interfaces/user.ts";

const baseURL = "https://localhost:7212/api/";

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

interface BookAPI {
  fetch: (searchString: string, page: number) => Promise<AxiosResponse>;
  create: (newBook: Book) => Promise<AxiosResponse>;
  update: (id: number, updatedBook: Book) => Promise<AxiosResponse>;
  delete: (id: number) => Promise<AxiosResponse>;
  markAsUnavailable: (id: number) => Promise<AxiosResponse>;
}

interface UserAPI {
  login: (userData: User) => Promise<AxiosResponse>;
  signup: (userData: User) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
  getProfile: () => Promise<AxiosResponse>;
}

const bookAPI: BookAPI = {
  fetch: (searchString, page) => apiClient.get(`manageBooks/${searchString}?page=${page}`),
  create: (newBook) => apiClient.post("manageBooks/", newBook),
  update: (id, updatedBook) => apiClient.put(`manageBooks/${id}`, updatedBook),
  delete: (id) => apiClient.delete(`manageBooks/${id}`),
  markAsUnavailable: (id) => apiClient.put(`manageBooks/${id}/mark-unavailable`)
};

const userAPI: UserAPI = {
  login: (userData) => apiClient.post("auth/login", userData),
  signup: (userData) => apiClient.post("auth/register", userData),
  logout: () => apiClient.post("auth/logout"),
  getProfile: () => apiClient.get("auth/profile")
};

export default {
  bookAPI,
  userAPI
};
