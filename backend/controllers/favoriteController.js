const Favorite = require('../models/Favorite');
const Book = require('../models/Book');

// @desc    Add book to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const favoriteExists = await Favorite.findOne({ where: { userId, bookId } });

    if (favoriteExists) {
      return res.status(400).json({ message: 'Book already in favorites' });
    }

    const favorite = await Favorite.create({ userId, bookId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove book from favorites
// @route   DELETE /api/favorites
// @access  Private
const removeFavorite = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const favorite = await Favorite.findOne({ where: { userId, bookId } });

    if (favorite) {
      await favorite.destroy();
      res.json({ message: 'Book removed from favorites' });
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/favorites/:userId
// @access  Private
const getUserFavorites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Book]
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites
};
