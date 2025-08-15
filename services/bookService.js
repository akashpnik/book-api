const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');
const express = require('express');

const router = express.Router();
const booksFilePath = path.join(__dirname, '..', 'data', 'books.json');

// Helper function to read books from the file
const readBooks = async () => {
    try {
        const data = await fs.readFile(booksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Helper function to write books to the file
const writeBooks = async (books) => {
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), 'utf8');
};

// Export a function that accepts the eventEmitter
module.exports = (eventEmitter) => {

    // GET /books -> Returns all books 
    router.get('/', async (req, res) => {
        try {
            const books = await readBooks();
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error reading books data' });
        }
    });

    // GET /books/:id -> Returns a single book by ID 
    router.get('/:id', async (req, res) => {
        try {
            const books = await readBooks();
            const book = books.find(b => b.id === parseInt(req.params.id));
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ message: 'Error reading books data' });
        }
    });

    // POST /books -> Adds a new book 
    router.post('/', async (req, res) => {
        try {
            const { title, author } = req.body;
            if (!title || !author) {
                return res.status(400).json({ message: 'Title and author are required' });
            }
            const books = await readBooks();
            const newBook = {
                id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1, // Generate a new ID
                title,
                author,
            };
            books.push(newBook);
            await writeBooks(books);
            
            // Emit "BookAdded" event 
            eventEmitter.emit('BookAdded', newBook);

            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({ message: 'Error adding book' });
        }
    });

    // PUT /books/:id -> Updates a book 
    router.put('/:id', async (req, res) => {
        try {
            const { title, author } = req.body;
            if (!title || !author) {
                return res.status(400).json({ message: 'Title and author are required' });
            }
            const books = await readBooks();
            const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
            if (bookIndex === -1) {
                return res.status(404).json({ message: 'Book not found' });
            }
            const updatedBook = { ...books[bookIndex], title, author };
            books[bookIndex] = updatedBook;
            await writeBooks(books);

            // Emit "BookUpdated" event 
            eventEmitter.emit('BookUpdated', updatedBook);

            res.json(updatedBook);
        } catch (error) {
            res.status(500).json({ message: 'Error updating book' });
        }
    });

    // DELETE /books/:id -> Deletes a book 
    router.delete('/:id', async (req, res) => {
        try {
            const books = await readBooks();
            const bookId = parseInt(req.params.id);
            const filteredBooks = books.filter(b => b.id !== bookId);
            if (books.length === filteredBooks.length) {
                return res.status(404).json({ message: 'Book not found' });
            }
            await writeBooks(filteredBooks);

            // Emit "BookDeleted" event 
            eventEmitter.emit('BookDeleted', bookId);

            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ message: 'Error deleting book' });
        }
    });

    return router;
};