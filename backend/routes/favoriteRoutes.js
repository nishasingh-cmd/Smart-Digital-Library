const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getUserFavorites
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addFavorite)
  .delete(protect, removeFavorite);

router.get('/:userId', protect, getUserFavorites);

module.exports = router;
