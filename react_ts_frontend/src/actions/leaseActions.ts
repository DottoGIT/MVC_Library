import { Lease } from "../interfaces/lease.ts";
import api from "./api.ts";

export enum LEASE_ACTION_TYPES {
    FETCH = "FETCH_LEASE",
    CREATE = "CREATE_LEASE",
    DELETE = "DELETE_LEASE",
    ACCEPT = "ACCEPT_LEASE",
    DECLINE = "DECLINE_LEASE",
    CLOSE = "CLOSE_LEASE",
  }
  
  export interface FetchLeaseAction {
    type: LEASE_ACTION_TYPES.FETCH;
    payload: {
      leases: Lease[];
      pagination: {
        currentPage: number;
        totalPages: number;
      };
    };
  }
  
  export interface DeleteLeaseAction {
    type: LEASE_ACTION_TYPES.DELETE;
    payload: number;
  }
  
  export interface AcceptLeaseAction {
    type: LEASE_ACTION_TYPES.ACCEPT;
    payload: number;
  }
  
  export interface DeclineLeaseAction {
    type: LEASE_ACTION_TYPES.DECLINE;
    payload: number;
  }
  
  export interface CloseLeaseAction {
    type: LEASE_ACTION_TYPES.CLOSE;
    payload: number;
  }
  
  export interface CreateLeaseAction {
    type: LEASE_ACTION_TYPES.CREATE;
    payload: Lease;
  }
  
  export type LeaseAction = 
    | FetchLeaseAction
    | DeleteLeaseAction
    | AcceptLeaseAction
    | DeclineLeaseAction
    | CloseLeaseAction
    | CreateLeaseAction
  

type ThunkLeaseAction = (dispatch: React.Dispatch<LeaseAction>) => void;

export const fetchLeases = (
  searchString: string,
  showAwaiting: boolean,
  showActive: boolean,
  showClosed: boolean,
  showDeclined: boolean,
  page: number
): ThunkLeaseAction => {
  return (dispatch) => {
    api.leaseAPI
      .fetch(searchString, showAwaiting, showActive, showClosed, showDeclined, page)
      .then((response) => {
        console.log(response);
        dispatch({
          type: LEASE_ACTION_TYPES.FETCH,
          payload: {
            leases: response.data.data,
            pagination: response.data.pagination
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

export const deleteLease = (id: number): ThunkLeaseAction => {
  return async (dispatch) => {
    await api.leaseAPI.delete(id);
    dispatch({
      type: LEASE_ACTION_TYPES.DELETE,
      payload: id
    });
  };
};

export const acceptLease = (id: number): ThunkLeaseAction => {
  return async (dispatch) => {
    await api.leaseAPI.accept(id);
    dispatch({
      type: LEASE_ACTION_TYPES.ACCEPT,
      payload: id
    });
  };
};

export const declineLease = (id: number): ThunkLeaseAction => {
  return async (dispatch) => {
    await api.leaseAPI.decline(id);
    dispatch({
      type: LEASE_ACTION_TYPES.DECLINE,
      payload: id
    });
  };
};

export const closeLease = (id: number): ThunkLeaseAction =>  {
  return async (dispatch) => {
    await api.leaseAPI.close(id);
    dispatch({
      type: LEASE_ACTION_TYPES.CLOSE,
      payload: id
    });
  };
};

export const createLease = (lease: Lease): ThunkLeaseAction => {
  return async (dispatch) => {
    const response = await api.leaseAPI.create(lease);
    dispatch({
      type: LEASE_ACTION_TYPES.CLOSE,
      payload: response.data
    });
  };
};