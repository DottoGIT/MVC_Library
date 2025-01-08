import { Book } from "../interfaces/book.ts";
import * as actions from "../actions/bookActions.ts";

export interface BookState {
  list: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

export const initialState: BookState = {
  list: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const bookReducer = (state = initialState, action: actions.BookAction): BookState => {
    switch (action.type) {
      case actions.BOOK_ACTION_TYPES.FETCH:
        return {
          ...state,
          list: [...action.payload.books],
          pagination: action.payload.pagination,
        };
      case actions.BOOK_ACTION_TYPES.CREATE:
        return {
          ...state,
          list: [action.payload, ...state.list],
        };
      case actions.BOOK_ACTION_TYPES.UPDATE:
        return {
          ...state,
          list: state.list.map((book) =>
            book.id === action.payload.id ? { ...book, ...action.payload } : book
          ),
        };
      case actions.BOOK_ACTION_TYPES.DELETE:
        return {
          ...state,
          list: state.list.filter((book) => book.id !== action.payload),
        };
      case actions.BOOK_ACTION_TYPES.MARK_UNAVAILABLE:
        return {
          ...state,
          list: state.list.map((book) =>
            book.id === action.payload ? { ...book, isPernamentlyUnavailable: true } : book
          ),
        };
      default:
        return state;
    }
  };
