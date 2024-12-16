const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3172;

app.use(express.json());

// Serve static files (e.g., index.html, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Load JSON data with error handling
function loadData(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
}

let books = loadData('books.json');
let authors = loadData('authors.json');

// Function to save data back to a file
function saveData(filename, data) {
  try {
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing to ${filename}:`, err);
  }
}

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
  saveData('books.json', books);
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
    saveData('books.json', books);
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
    saveData('books.json', books);
    res.json({ message: 'Book deleted' });
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
