const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Load JSON data
const books = JSON.parse(fs.readFileSync('books.json', 'utf-8'));
const authors = JSON.parse(fs.readFileSync('authors.json', 'utf-8'));

// GET all books
app.get('/books', (req, res) => {
res.json(books);
});

// GET a specific book by ID
app.get('/books/:id', (req, res) => {
const book = books.find(b => b.id === parseInt(req.params.id));
if (book) {
res.json(book);
} else {
res.status(404).json({ error: 'Book not found' });
}
});

// POST a new book (admin only)
app.post('/books', (req, res) => {
const newBook = {
id: books.length + 1,
...req.body
};
books.push(newBook);
fs.writeFileSync('books.json', JSON.stringify(books));
res.status(201).json(newBook);
});

// PUT update a book (admin only)
app.put('/books/:id', (req, res) => {
const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
if (bookIndex !== -1) {
books[bookIndex] = {
    ...books[bookIndex],
    ...req.body
};
fs.writeFileSync('books.json', JSON.stringify(books));
res.json(books[bookIndex]);
} else {
res.status(404).json({ error: 'Book not found' });
}
});

// DELETE a book (admin only)
app.delete('/books/:id', (req, res) => {
const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
if (bookIndex !== -1) {
books.splice(bookIndex, 1);
fs.writeFileSync('books.json', JSON.stringify(books));
res.json({ message: 'Book deleted' });
} else {
res.status(404).json({ error: 'Book not found' });
}
});

// ... (similar routes for authors)

// Start the server
app.listen(port, () => {
console.log(`Server listening on port ${port}`);
});