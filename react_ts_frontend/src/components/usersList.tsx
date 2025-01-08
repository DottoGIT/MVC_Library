import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as actions from "../actions/userActions.ts";
import { UserListState} from "../reducers/userReducer.ts";

type PropsFromRedux = ConnectedProps<typeof connector>;

const UsersList: React.FC<PropsFromRedux> = ({
  usersList,
  pagination,
  fetchUsers,
}: PropsFromRedux) => {
  const [searchString, setSearchString] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch users when search or page changes
  useEffect(() => {
    fetchUsers(searchString, currentPage);
  }, [fetchUsers, searchString, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(searchString, page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-start mb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers(searchString, currentPage);
          }}
          className="d-flex"
          role="search"
        >
          <input
            type="search"
            value={searchString}
            onChange={handleSearchChange}
            className="form-control me-2"
            placeholder="Search..."
            aria-label="Search"
            style={{ width: "250px" }}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div style={{ marginTop: "20px" }}></div>

      <ul className="list-group list-group-light">
        {usersList.map((item) => (
          <li key={item.userName} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">
                {item.firstName} {item.lastName} ({item.userName})
              </div>
              <div className="text-muted">{item.email}</div>
            </div>
            <div>
              {item.role === 0 ? (
                <span className="badge text-bg-danger rounded-pill">Librarian</span>
              ) : (
                <span className="badge text-bg-primary rounded-pill">User</span>
              )}
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

const mapStateToProps = (state: { userListReducer: UserListState }) => ({
  usersList: state.userListReducer.list,
  pagination: state.userListReducer.pagination,
});

const mapActionsToProps = {
  fetchUsers: actions.fetchUsers,
};

const connector = connect(mapStateToProps, mapActionsToProps);

export default connector(UsersList);
