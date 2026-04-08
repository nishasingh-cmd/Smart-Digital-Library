"""
Models Module
-------------
Defines data structures for the application.
"""


class Book:
    def __init__(self, id, title, author, isbn=None):
        self.id = id
        self.title = title
        self.author = author
        self.isbn = isbn

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn
        }


def sample_books():
    return [
        Book(1, "Atomic Habits", "James Clear", "0735211299"),
        Book(2, "Deep Work", "Cal Newport", "1455586692"),
        Book(3, "Rich Dad Poor Dad", "Robert Kiyosaki", "1612680194"),
    ]