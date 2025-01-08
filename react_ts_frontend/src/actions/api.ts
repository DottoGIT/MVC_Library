import axios, { AxiosResponse } from "axios";
import { Book } from "../interfaces/book.ts";
import { User } from "../interfaces/user.ts";
import { Lease } from "../interfaces/lease.ts";

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
};

interface UserAPI {
  login: (userData: User) => Promise<AxiosResponse>;
  signup: (userData: User) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
  getProfile: () => Promise<AxiosResponse>;
  getUsers: (serchString: string, page: number) => Promise<AxiosResponse>;
  deleteUser: (id:string) => Promise<AxiosResponse>
};

interface LeaseAPI {
  fetch: (searchString: string, showAwaiting: boolean, showActive:boolean, showClose:boolean, showDeclined: boolean, page :number) => Promise<AxiosResponse>;
  create: (newReservation: Lease) => Promise<AxiosResponse>;
  accept: (id: number) => Promise<AxiosResponse>;
  decline: (id: number) => Promise<AxiosResponse>;
  close: (id: number) => Promise<AxiosResponse>;
  delete: (id: number) => Promise<AxiosResponse>;
};

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
  getProfile: () => apiClient.get("auth/profile"),
  getUsers: (serchString, page) => apiClient.get(`ManageUsers/${serchString}?${page}`),
  deleteUser: (id) => apiClient.delete(`auth/${id}/delete`)
};

const leaseAPI: LeaseAPI = {
  fetch: (searchString, showAwaiting, showActive, showClose, showDeclined, page) => apiClient.get(`manageLeases/${searchString}?showAwaiting=${showAwaiting}&showActive=${showActive}&showClosed=${showClose}&showDeclined=${showDeclined}&page=${page}`),
  create: (newReservation) => apiClient.post(`manageLeases/`, newReservation),
  accept: (id) => apiClient.put(`manageLeases/${id}/accept`),
  decline: (id) => apiClient.put(`manageLeases/${id}/decline`),
  close: (id) => apiClient.put(`manageLeases/${id}/close`),
  delete: (id) => apiClient.delete(`manageLeases/${id}/delete`)
};

const api = {
  bookAPI,
  userAPI,
  leaseAPI
};

export default api;