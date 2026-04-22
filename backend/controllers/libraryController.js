const MyLibrary = require('../models/MyLibrary');
const Book = require('../models/Book');

// @desc    Add book to user's library
// @route   POST /api/library
// @access  Private
const addToLibrary = async (req, res) => {
  const { bookId, notes } = req.body;
  const userId = req.user.id;

  try {
    const entryExists = await MyLibrary.findOne({ where: { userId, bookId } });

    if (entryExists) {
      return res.status(400).json({ message: 'Book already in your library' });
    }

    const entry = await MyLibrary.create({ userId, bookId, notes });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's library
// @route   GET /api/library/:userId
// @access  Private
const getUserLibrary = async (req, res) => {
  const userId = req.params.userId;

  try {
    const libraryEntries = await MyLibrary.findAll({
      where: { userId },
      include: [Book]
    });
    res.json(libraryEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update library entry (notes)
// @route   PUT /api/library/:id
// @access  Private
const updateLibraryEntry = async (req, res) => {
  const { notes } = req.body;
  const entryId = req.params.id;

  try {
    const entry = await MyLibrary.findByPk(entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Ensure user owns this entry
    if (entry.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    entry.notes = notes || entry.notes;
    await entry.save();

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove book from library
// @route   DELETE /api/library
// @access  Private
const removeFromLibrary = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const entry = await MyLibrary.findOne({ where: { userId, bookId } });

    if (entry) {
      await entry.destroy();
      res.json({ message: 'Book removed from your library' });
    } else {
      res.status(404).json({ message: 'Book not found in library' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToLibrary,
  getUserLibrary,
  updateLibraryEntry,
  removeFromLibrary
};
