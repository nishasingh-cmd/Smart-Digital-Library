const express = require('express');
const router = express.Router();
const {
  addToLibrary,
  getUserLibrary,
  updateLibraryEntry,
  removeFromLibrary
} = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addToLibrary)
  .delete(protect, removeFromLibrary);

router.route('/:id')
  .put(protect, updateLibraryEntry);

router.get('/:userId', protect, getUserLibrary);

module.exports = router;
