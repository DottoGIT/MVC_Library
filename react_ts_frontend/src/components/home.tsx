import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as book_actions from "../actions/bookActions.ts";
import * as lease_actions from "../actions/leaseActions.ts";
import { BookState } from "../reducers/bookReducer.ts";
import { Book } from "../interfaces/book.ts";
import { User } from "../interfaces/user";

type PropsFromRedux = ConnectedProps<typeof connector>;

const Home: React.FC<PropsFromRedux> = ({ booksList, pagination, fetchBooks, currentUser, createReservation }) => {
  const [searchString, setSearchString] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchBooks(searchString, currentPage);
  }, [fetchBooks, searchString, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBooks(searchString, page);
  };

  const handleReserve = async (bookId: number) => {
    try {
      await createReservation({ bookId, userId: currentUser.id! });
      await fetchBooks(searchString, currentPage);
    } catch (error) {
      console.error("Failed to reserve book:", error);
      alert("Failed to reserve the book. Please try again.");
    }
  };
  

  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Welcome to MVC Library!</h1>
            {/* Display message based on user authentication */}
            {currentUser ? (
              <p className="lead text-body-secondary">
                Discover thousands of books in our collection below. Sign up to reserve your favorites, and our librarian will confirm your reservations shortly!
              </p>
            ) : (
              <p className="lead text-body-secondary">
                Sign in to reserve your favorite books and enjoy all the features of the library!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="d-flex justify-content-end mb-3">
        <form className="d-flex" role="search">
          <input
            type="search"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="form-control me-2"
            placeholder="Search..."
            aria-label="Search"
            style={{ width: "250px" }}
          />
          <button type="button" className="btn btn-primary" onClick={() => fetchBooks(searchString, 1)}>
            Search
          </button>
        </form>
      </div>

      {/* Books List */}
      <div className="album py-5">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {booksList.map((book: Book) => (
              <div key={book.id} className="col">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">Author: {book.author}</p>
                    <p className="card-text">Publisher: {book.publisher}</p>
                    <p className="card-text">Year of publication: {book.yearOfPublication}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-body-secondary">{book.price} zł</small>
                      {book.isReserved ? (
                        <span className="badge bg-warning-subtle text-primary-emphasis rounded-pill">Reserved</span>
                      ) : (
                        <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">Available</span>
                      )}
                    </div>
                    {/* Reserve Button */}
                    {currentUser?.role === 1 && !book.isReserved && (
                      <button
                        className="btn btn-success mt-2"
                        onClick={() => handleReserve(book.id)}
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                  <button className="page-link mx-1" onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Map state and actions to props
const mapStateToProps = (state: { bookReducer: BookState, userReducer: { currentUser: User } }) => ({
  booksList: state.bookReducer.list,
  pagination: state.bookReducer.pagination,
  currentUser: state.userReducer.currentUser, // Get the currentUser from userReducer
});

const mapActionsToProps = {
  fetchBooks: book_actions.fetch,
  createReservation: lease_actions.createLease
};

const connector = connect(mapStateToProps, mapActionsToProps);

export default connector(Home);
