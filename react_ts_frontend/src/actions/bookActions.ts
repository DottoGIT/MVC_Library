import api from "./api.ts";
import { Book } from "../interfaces/book.ts";

export enum BOOK_ACTION_TYPES {
    FETCH = "FETCH_BOOK",
    CREATE = "CREATE_BOOK",
    UPDATE = "UPDATE_BOOK",
    DELETE = "DELETE_BOOK",
    MARK_UNAVAILABLE= "MARK_UNAVAILABLE_BOOK",
  }

export interface FetchBookAction {
    type: BOOK_ACTION_TYPES.FETCH;
    payload: {
      books: Book[];
      pagination: {
        currentPage: number;
        totalPages: number;
      }
    }
  }

export interface DeleteBookAction {
  type: BOOK_ACTION_TYPES.DELETE;
  payload: number;
}

export interface MarkAsUnavailableAction {
  type: BOOK_ACTION_TYPES.MARK_UNAVAILABLE;
  payload: number;
}

export interface CreateBookAction {
  type: BOOK_ACTION_TYPES.CREATE;
  payload: Book;
}

export interface UpdateBookAction {
  type: BOOK_ACTION_TYPES.UPDATE;
  payload: Book;
}

export type BookAction = FetchBookAction | DeleteBookAction | MarkAsUnavailableAction | CreateBookAction | UpdateBookAction;

type ThunkBookAction = (dispatch: React.Dispatch<BookAction>) => void;

export const fetch = (searchString: string, page: number): ThunkBookAction => {
  return (dispatch) => {
    api.bookAPI
      .fetch(searchString, page)
      .then((response) => {
        console.log(response);
        dispatch({
          type: BOOK_ACTION_TYPES.FETCH,
          payload: {
            books: response.data.data,
            pagination: response.data.pagination
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const deleteBook = (id: number): ThunkBookAction => {
  return async (dispatch) => {
    await api.bookAPI.delete(id);
    dispatch({
      type: BOOK_ACTION_TYPES.DELETE,
      payload: id
    });
  };
};

export const markAsUnavailable = (id: number): ThunkBookAction => {
  return async (dispatch) => {
    await api.bookAPI.markAsUnavailable(id);
    dispatch({
      type: BOOK_ACTION_TYPES.MARK_UNAVAILABLE,
      payload: id
    });
  };
};

export const createBook = (book: Book): ThunkBookAction => {
  return async (dispatch) => {
    const response = await api.bookAPI.create(book);
    dispatch({
      type: BOOK_ACTION_TYPES.CREATE,
      payload: response.data
    });
  };
};

export const updateBook = (id: number, book: Book): ThunkBookAction => {
  return async (dispatch) => {
    const response = await api.bookAPI.update(id, book);
    dispatch({
      type: BOOK_ACTION_TYPES.UPDATE,
      payload: response.data
    });
  };
};
