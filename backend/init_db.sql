-- Smart Digital Library - Database Initialization Script

-- Create Database
CREATE DATABASE IF NOT EXISTS smart_library;
USE smart_library;

-- The tables will be automatically created by Sequelize when the server starts due to { alter: true }
-- However, here are the manual queries for reference:

/*
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Books (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    isbn VARCHAR(255),
    rating FLOAT DEFAULT 0,
    pages INT,
    year INT,
    language VARCHAR(255) DEFAULT 'English',
    hasAudio BOOLEAN DEFAULT FALSE,
    audioDuration VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    bookId VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES Books(id) ON DELETE CASCADE,
    UNIQUE KEY (userId, bookId)
);
*/

-- Sample Book Data
INSERT IGNORE INTO Books (id, title, author, description, category, cover_image, isbn, rating, pages, year, language, hasAudio, audioDuration, createdAt, updatedAt)
VALUES 
('db-1', 'The Great Gatsby', 'F. Scott Fitzgerald', 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', 'fiction', 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg', '9780743273565', 4.4, 180, 1925, 'English', true, '4h 45m', NOW(), NOW()),
('db-2', 'The Selfish Gene', 'Richard Dawkins', 'A masterpiece of science writing that explains the gene-centered view of evolution.', 'science', 'https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg', '9780198788607', 4.6, 360, 1976, 'English', false, NULL, NOW(), NOW()),
('db-3', 'The Pragmatic Programmer', 'Andrew Hunt and David Thomas', 'One of the most influential books in software development, providing timeless advice.', 'technology', 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg', '9780135957059', 4.8, 352, 1999, 'English', true, '10h 0m', NOW(), NOW());
