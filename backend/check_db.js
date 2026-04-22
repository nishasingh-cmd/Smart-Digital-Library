const { sequelize } = require('./config/db');
const Book = require('./models/Book');
const MyLibrary = require('./models/MyLibrary');

async function check() {
  try {
    await sequelize.authenticate();
    const books = await Book.count();
    const library = await MyLibrary.count();
    console.log(`Books: ${books}`);
    console.log(`Library entries: ${library}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
