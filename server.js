// 1. Import necessary modules
const express = require('express');
const EventEmitter = require('events');

// 2. Initialize Express app and EventEmitter
const app = express();
const port = 3000;
const eventEmitter = new EventEmitter();

// 3. Middleware to parse JSON bodies
app.use(express.json()); // This allows us to read JSON from request bodies

// 4. Setup Event Listeners (from Story 5)
// These listeners will log messages when the corresponding events are emitted.
eventEmitter.on('BookAdded', (book) => {
    console.log(`Event: Book Added -> Title: ${book.title}, Author: ${book.author}`);
});

eventEmitter.on('BookUpdated', (book) => {
    console.log(`Event: Book Updated -> ID: ${book.id}, Title: ${book.title}`);
});

eventEmitter.on('BookDeleted', (id) => {
    console.log(`Event: Book Deleted -> ID: ${id}`);
});


// 5. Define the Root Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Book Management API" });
});

// We will add the /books routes here in the next step.
const bookRoutes = require('./services/bookService');
app.use('/books', bookRoutes(eventEmitter)); // Pass the eventEmitter to the routes


// 6. Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});