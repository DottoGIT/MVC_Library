import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as actions from "../actions/bookActions.ts";
import { BookState } from "../reducers/bookReducer.ts";
import { Book } from "../interfaces/book.ts";
import BookForm from "./bookForm.tsx";

type PropsFromRedux = ConnectedProps<typeof connector>;

const ManageBooksList: React.FC<PropsFromRedux> = ({ booksList, pagination, fetchBooks, deleteBook, markAsUnavailable}) => {
  const [searchString, setSearchString] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);


  useEffect(() => {
    fetchBooks(searchString, currentPage);
  }, [fetchBooks, searchString, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBooks(searchString, page);
  };
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteBook(id);
    }
  };

  const handleMarkAsUnavailable = (id: number) => {
    if (window.confirm("Are you sure you want to mark this book as unavailable?")) {
      markAsUnavailable(id);
    }
  };

  const handleAddBookClick = () => {
    setBookToEdit(undefined);
    setShowModal(true);
  };

  const handleEditBook = (book: Book) => {
    setBookToEdit(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-start mb-3">
        <button className="btn btn-success me-2" onClick={handleAddBookClick}>Add Book</button>
            <input
              type="search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="form-control me-2"
              placeholder="Name, Author..."
              aria-label="Search"
              style={{ width: "250px" }}
            />
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{bookToEdit ? "Edit Book" : "Add New Book"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <BookForm closeModal={handleCloseModal} bookToEdit={bookToEdit} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="list-group list-group-light">
        {booksList.map((book: Book) => (
          <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">{book.title}</div>
              <div className="text-muted">{book.author}</div>
            </div>
            <div>
              {book.isPernamentlyUnavailable ? (
                <span className="badge text-bg-danger rounded-pill">Unavailable</span>
              ) : (
                <>
                  {book.isReserved ? (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleMarkAsUnavailable(book.id)}> Mark as Unavailable </button>
                  ) : (
                    
                    <button onClick={() => handleDelete(book.id)} className="btn btn-sm btn-danger me-2"> Delete </button>

                  )}
                  <button className="btn btn-sm btn-primary" onClick={() => handleEditBook(book)}>Edit</button>
                </>
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

const mapStateToProps = (state: { bookReducer: BookState }) => ({
  booksList: state.bookReducer.list,
  pagination: state.bookReducer.pagination
});

const mapActionsToProps = {
  fetchBooks: actions.fetch,
  deleteBook: actions.deleteBook,
  markAsUnavailable: actions.markAsUnavailable
};

const connector = connect(mapStateToProps, mapActionsToProps);

export default connector(ManageBooksList);
