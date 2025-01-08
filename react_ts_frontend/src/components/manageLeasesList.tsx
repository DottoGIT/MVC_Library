import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as actions from "../actions/leaseActions.ts"; // Lease actions
import { Lease } from "../interfaces/lease.ts"; // Lease interface
import { LeaseState } from "../reducers/leaseReducer.ts"; // LeaseState interface
import { UserState } from "../reducers/userReducer.ts";

type PropsFromRedux = ConnectedProps<typeof connector>;

const ManageLeasesList: React.FC<PropsFromRedux> = ({
  currentUser,
  leasesList,
  pagination,
  fetchLeases,
  acceptLease,
  declineLease,
  closeLease,
}) => {
  const [searchString, setSearchString] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAwaiting, setShowAwaiting] = useState<boolean>(false);
  const [showActive, setShowActive] = useState<boolean>(false);
  const [showClosed, setShowClosed] = useState<boolean>(false);
  const [showDeclined, setShowDeclined] = useState<boolean>(false);

  useEffect(() => {
    fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage);
  }, [fetchLeases, searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, page);
  };
  const handleAcceptLease = async (id: number) => {
    try {
      await acceptLease(id);
      await fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage);
    } catch (error) {
      console.error("Failed to accept lease:", error);
      alert("Failed to accept lease.");
    }
  };
  
  const handleDeclineLease = async (id: number) => {
    try {
      await declineLease(id);
      await fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage);
    } catch (error) {
      console.error("Failed to decline lease:", error);
      alert("Failed to decline lease.");
    }
  };
  
  const handleCloseLease = async (id: number) => {
    try {
      await closeLease(id);
      await fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage);
    } catch (error) {
      console.error("Failed to close lease:", error);
      alert("Failed to close lease.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-start mb-3 align-items-center">
        <input
          type="search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          className="form-control me-2"
          placeholder="Search by book name..."
          style={{ width: "250px" }}
        />
        <button
          className="btn btn-primary me-2"
          onClick={() => fetchLeases(searchString, showAwaiting, showActive, showClosed, showDeclined, currentPage)}
        >
          Search
        </button>

        {[
          { id: "showAwaiting", label: "Awaiting", value: showAwaiting, setter: setShowAwaiting, color: "warning" },
          { id: "showActive", label: "Active", value: showActive, setter: setShowActive, color: "success" },
          { id: "showClosed", label: "Closed", value: showClosed, setter: setShowClosed, color: "primary" },
          { id: "showDeclined", label: "Declined", value: showDeclined, setter: setShowDeclined, color: "danger" },
        ].map((filter) => (
          <div className="form-check me-3" key={filter.id}>
            <input
              type="checkbox"
              className="form-check-input"
              id={filter.id}
              checked={filter.value}
              onChange={() => filter.setter(!filter.value)}
            />
            <label className={`form-check-label text-${filter.color}`} htmlFor={filter.id}>
              {filter.label}
            </label>
          </div>
        ))}
      </div>

      <ul className="list-group list-group-light">
        {leasesList.map((lease: Lease) => (
          <li key={lease.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">{lease.book?.title}</div>
              <div className="text-muted">{lease.user?.userName}</div>
            </div>
            <div className="align-items-center">
              {lease.state === 2 && (
                <>
                  {currentUser?.role === 0 && (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleAcceptLease(lease.id!)}>
                        Accept
                      </button>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeclineLease(lease.id!)}>
                        Decline
                      </button>
                    </>
                  )}
                  {currentUser?.id === lease.userId && (
                    <>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeclineLease(lease.id!)}>
                        Cancel
                      </button>
                    </>
                  )}

                  <span className="badge text-bg-warning me-2">Awaiting</span>
                </>
              )}
              {lease.state === 0 && <span className="badge text-bg-danger me-2">Declined</span>}
              {lease.state === 3 && (
                <>
                  {currentUser?.role === 0 && (
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleCloseLease(lease.id!)}>
                    Close
                    </button>
                  )}
                  <span className="badge text-bg-success me-2">Active</span>
                </>
              )}
              {lease.state === 1 && <span className="badge text-bg-primary me-2">Closed</span>}
            </div>
          </li>
        ))}
      </ul>

      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link mx-1" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const mapStateToProps = (state: { leaseReducer: LeaseState, userReducer: UserState}) => ({
  leasesList: state.leaseReducer.list,
  pagination: state.leaseReducer.pagination,
  currentUser: state.userReducer.currentUser
});

const mapActionsToProps = {
  fetchLeases: actions.fetchLeases,
  acceptLease: actions.acceptLease,
  declineLease: actions.declineLease,
  closeLease: actions.closeLease,
};

const connector = connect(mapStateToProps, mapActionsToProps);
export default connector(ManageLeasesList);
