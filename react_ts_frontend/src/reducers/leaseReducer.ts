import { Lease } from "../interfaces/lease.ts";
import * as actions from "../actions/leaseActions.ts";

export interface LeaseState {
  list: Lease[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

export const initialState: LeaseState = {
  list: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const leaseReducer = (state = initialState, action: actions.LeaseAction): LeaseState => {
  switch (action.type) {
    case actions.LEASE_ACTION_TYPES.FETCH:
      return {
        ...state,
        list: [...action.payload.leases],
        pagination: action.payload.pagination,
      };

    case actions.LEASE_ACTION_TYPES.CREATE:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };

    case actions.LEASE_ACTION_TYPES.DELETE:
      return {
        ...state,
        list: state.list.filter((lease) => lease.id !== action.payload),
      };

    case actions.LEASE_ACTION_TYPES.ACCEPT:
      return {
        ...state,
        list: state.list.map((lease) =>
          lease.id === action.payload ? { ...lease, State: 3 } : lease
        ),
      };

    case actions.LEASE_ACTION_TYPES.DECLINE:
      return {
        ...state,
        list: state.list.map((lease) =>
          lease.id === action.payload ? { ...lease, State: 0 } : lease
        ),
      };

    case actions.LEASE_ACTION_TYPES.CLOSE:
      return {
        ...state,
        list: state.list.map((lease) =>
          lease.id === action.payload ? { ...lease, State: 1 } : lease
        ),
      };

    default:
      return state;
  }
};
