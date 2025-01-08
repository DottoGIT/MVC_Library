export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    yearOfPublication: number;
    price: number;
    isPernamentlyUnavailable: boolean;
    isReserved: boolean;
    canBeDeleted?: boolean;
}
  