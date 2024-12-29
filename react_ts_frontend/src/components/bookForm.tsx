import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as actions from "../actions/bookActions.ts";
import { Book } from "../interfaces/book.ts";

type PropsFromRedux = ConnectedProps<typeof connector>;

interface BookFormProps extends PropsFromRedux {
  closeModal: () => void;
  bookToEdit?: Book;
  createBook: (book: Book) => void;
}

const BookForm: React.FC<BookFormProps> = ({ createBook, updateBook, bookToEdit, closeModal }) => {
  const [title, setTitle] = useState(bookToEdit?.title || "");
  const [author, setAuthor] = useState(bookToEdit?.author || "");
  const [publisher, setPublisher] = useState(bookToEdit?.publisher || "");
  const [yearOfPublication, setYearOfPublication] = useState(bookToEdit?.yearOfPublication || 0);
  const [price, setPrice] = useState<number>(bookToEdit?.price || 0);
  const [isPernamentlyUnavailable, setIsPernamentlyUnavailable] = useState<boolean>(bookToEdit?.isPernamentlyUnavailable || false);
  const [isReserved, setIsReserved] = useState<boolean>(bookToEdit?.isReserved || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookData: Book = {
        id: bookToEdit?.id || 0,
        title,
        author,
        publisher,
        yearOfPublication: yearOfPublication,
        price: price,
        isPernamentlyUnavailable,
        isReserved
      };
  

    if (bookToEdit) {
        updateBook(bookToEdit.id, bookData);
    } else {
      createBook(bookData);
    }

    closeModal();
  };

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setPublisher(bookToEdit.publisher);
      setYearOfPublication(bookToEdit.yearOfPublication);
      setPrice(bookToEdit.price);
    }
  }, [bookToEdit]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Author</label>
        <input
          type="text"
          className="form-control"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Publisher</label>
        <input
          type="text"
          className="form-control"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Year of Publication</label>
        <input
          type="number"
          className="form-control"
          value={yearOfPublication}
          onChange={(e) => setYearOfPublication(parseInt(e.target.value))}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {bookToEdit ? "Update" : "Add"} Book
      </button>
    </form>
  );
};

const mapDispatchToProps = {
  createBook: actions.createBook,
  updateBook: actions.updateBook,
};

const connector = connect(null, mapDispatchToProps);

export default connector(BookForm);
