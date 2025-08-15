# Book Management REST API

This is a simple REST API for managing a collection of books. The application is built with Node.js and Express, and it stores book data in a `books.json` file. 

## Prerequisites

Before you begin, ensure you have the following installed:
* Node.js (v14 or newer)
* npm (Node Package Manager)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akashpnik/book-api
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd book-api
    ```

3.  **Install the dependencies:**
    This command will install `express` and other necessary packages. 
    ```bash
    npm install
    ```

## Running the Application

To start the server, run the following command. The application will use `nodemon` to automatically restart whenever you make changes to the code.

```bash
npm start
```

The server will be running on `http://localhost:3000`. 

## API Endpoints

The following endpoints are available to manage the book collection.

### Get All Books
Returns a list of all books in the collection. 
You can use POSTMAN
* **Method:** `GET`
* [cite_start]**URL:** `/books`
* **Success Response:** `200 OK` with an array of book objects.

### Get a Single Book by ID
Returns a single book that matches the provided ID.
* **Method:** `GET`
* **URL:** `/books/:id` 
* **Success Response:** `200 OK` with the book object.
* **Error Response:** `404 Not Found` if the book does not exist.

### Add a New Book
Adds a new book to the collection.
* **Method:** `POST`
* **URL:** `/books`
* **Body (JSON):** Requires a `title` and `author`.
    ```json
    {
        "title": "Malgudi Days",
        "author": "R.K Narayan"
    }
    ```
* **Success Response:** `201 Created` with the newly created book object.

### Update a Book
Updates the details of an existing book by its ID.
* **Method:** `PUT`
* **URL:** `/books/:id`
* **Body (JSON):**
    ```json
    {
       "title": "Malgudi Days"(revised),
       "author": "R.K Narayan"
    }
    ```
* **Success Response:** `200 OK` with the updated book object.
* **Error Response:** `404 Not Found` if the book does not exist.

### Delete a Book
Deletes a book from the collection by its ID.
* **Method:** `DELETE`
* **URL:** `/books/:id` 
* **Success Response:** `204 No Content`.
* **Error Response:** `404 Not Found` if the book does not exist.
