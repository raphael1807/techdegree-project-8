// ------------------------------------------
// **** IMPORTS ****
// EXPRESS APP, ROUTER and IMPORTS
// ------------------------------------------
var express = require('express');
var router = express.Router();
const { Book } = require('../models/');



// ------------------------------------------
// **** FUNCTIONS ****
// Handler function to wrap each route
// ------------------------------------------
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      // Forward error to the global error handler
      next(err);
    }
  }
}
// ------------------------------------------
// Request Error Handler
// ------------------------------------------
function requestErrorHandler(errStatus, msg) {
  const err = new Error(msg);
  err.status = errStatus;
  throw err;
};

// ------------------------------------------
// **** MAIN ROUTES ****
// Get / - Home route redirects to /books
// ------------------------------------------
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// ------------------------------------------
// Get /books - Shows the full list of books
// ------------------------------------------
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'My collected books 📚' });
}));

// ------------------------------------------
// Get /books/new - Shows the create new book form
// ------------------------------------------
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
}));

// ------------------------------------------
// Post /books/new - Posts a new book to the database
// ------------------------------------------
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors });
    } else {
      throw error;
    }
  }
}));

// ------------------------------------------
// Get /books/:id - Shows book detail form
// ------------------------------------------
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book });
  } else {
    requestErrorHandler(404, `Your requested book hasn't been found in our database.`);
  }
}));

// ------------------------------------------
// Post /books/:id - Updates book info in the database
// ------------------------------------------
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      requestErrorHandler(404, `Your requested book isn't in our database.`);
    }
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update_book', { book, errors: err.errors, title: 'Error' })
    } else {
      throw err;
    }
  }
}));

// ------------------------------------------
// Post /books/:id/delete - Deletes a book
// ------------------------------------------
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy(req.body);
    res.redirect('/');
  } else {
    requestErrorHandler(500, `Oops - Our servers seems to be on a break. 🚧`);
  }
}));


// ------------------------------------------
// Export router
// ------------------------------------------
module.exports = router;
