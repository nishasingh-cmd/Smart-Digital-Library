const Book = require('../models/Book');
const MyLibrary = require('../models/MyLibrary');
const { Op } = require('sequelize');

// @desc    Fetch all books with search and filter
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  const { query, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let where = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (query) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query}%` } },
      { author: { [Op.like]: `%${query}%` } }
    ];
  }

  try {
    const { count, rows } = await Book.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      books: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crypto = require('crypto');

// @desc    Add new book
// @route   POST /api/books
// @access  Public
const createBook = async (req, res) => {
  const { title, author, description, category, cover_image, isbn, rating, pages, year, language, hasAudio, audioDuration } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and Author are required' });
  }

  try {
    const book = await Book.create({
      id: crypto.randomUUID(),
      title,
      author,
      description,
      category,
      cover_image,
      isbn,
      rating: rating || 0,
      pages,
      year,
      language: language || 'English',
      hasAudio: hasAudio || false,
      audioDuration
    });

    // Auto-add to creator's library
    await MyLibrary.create({
      userId: req.user.id,
      bookId: book.id,
      notes: 'Initial entry (Creator)'
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Public
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      const updatedBook = await book.update(req.body);
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      await book.destroy();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
