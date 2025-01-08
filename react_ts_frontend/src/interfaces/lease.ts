import { Book } from "./book";
import { User } from "./user";

export interface Lease
{
    id?: number;
    leaseDate?: Date;
    returnDate?: Date;
    state?: number;
    userId: string;
    bookId: number;
    book?: Book
    user?: User
}