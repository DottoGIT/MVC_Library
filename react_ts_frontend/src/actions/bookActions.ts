import api from "./api.ts";
import { Book } from "../interfaces/book.ts";

export enum ACTION_TYPES {
    FETCH = "FETCH",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    MARK_UNAVAILABLE= "MARK_UNAVAILABLE",
  }

export interface FetchAction {
    type: ACTION_TYPES.FETCH;
    payload: {
      books: Book[];
      pagination: {
        currentPage: number;
        totalPages: number;
      }
    }
  }

export interface DeleteAction {
  type: ACTION_TYPES.DELETE;
  payload: number;
}

export interface MarkAsUnavailableAction {
  type: ACTION_TYPES.MARK_UNAVAILABLE;
  payload: number;
}

export interface CreateAction {
  type: ACTION_TYPES.CREATE;
  payload: Book;
}

export interface UpdateAction {
  type: ACTION_TYPES.UPDATE;
  payload: Book;
}

export type BookAction = FetchAction | DeleteAction | MarkAsUnavailableAction | CreateAction | UpdateAction;

type ThunkAction = (dispatch: React.Dispatch<BookAction>) => void;

export const fetch = (searchString: string, page: number): ThunkAction => {
  return (dispatch) => {
    api.bookAPI
      .fetch(searchString, page)
      .then((response) => {
        console.log(response);
        dispatch({
          type: ACTION_TYPES.FETCH,
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

export const deleteBook = (id: number): ThunkAction => {
  return (dispatch) => {
    api.bookAPI
      .delete(id)
      .then(() => {
        dispatch({
          type: ACTION_TYPES.DELETE,
          payload: id,
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 403) {
          alert('You do not have permission to delete this book.');
        }
      });
  };
};

export const markAsUnavailable = (id: number): ThunkAction => {
  return (dispatch) => {
    api.bookAPI
      .markAsUnavailable(id)
      .then(() => {
        dispatch({
          type: ACTION_TYPES.MARK_UNAVAILABLE,
          payload: id,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const createBook = (book: Book): ThunkAction => {
  return (dispatch) => {
    api.bookAPI
      .create(book)
      .then((response) => {
        dispatch({
          type: ACTION_TYPES.CREATE,
          payload: response.data,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const updateBook = (id: number, book: Book): ThunkAction => {
  return (dispatch) => {
    api.bookAPI
      .update(id, book)
      .then((response) => {
        dispatch({
          type: ACTION_TYPES.UPDATE,
          payload: response.data,
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 400) {
          alert('Wrong book credentials');
        }
      });
  };
};
