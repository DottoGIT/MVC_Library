import axios, { AxiosResponse } from "axios";
import { Book } from "../interfaces/book.ts";

const baseURL = "https://localhost:7212/api/";

interface BookAPI {
  fetch: (searchString: string, page: number) => Promise<AxiosResponse>;
  create: (newBook: Book) => Promise<AxiosResponse>;
  update: (id: number, updatedBook: Book) => Promise<AxiosResponse>;
  delete: (id: number) => Promise<AxiosResponse>;
  markAsUnavailable: (id: number) => Promise<AxiosResponse>;
}

const bookAPI = (url: string = baseURL + 'manageBooks/'): BookAPI => {
  return {
    fetch: (searchString, page) => axios.get(url + searchString + "?page=" + page),
    create: (newBook: Book) => axios.post(url, newBook),
    update: (id: number, updatedBook: Book) => axios.put(url + id, updatedBook),
    delete: (id: number) => axios.delete(url + id),
    markAsUnavailable: (id: number) => axios.put(url + id + "/mark-unavailable")
  };
};

export default {
  bookAPI
};
