"""
📚 Digital Library Utility Module
--------------------------------
This file contains helper functions for the Digital Library system.
Currently used for demonstration and future backend expansion.
"""

import datetime


class LibraryUtils:
    """Utility class for library-related operations"""

    @staticmethod
    def get_welcome_message(user="Guest"):
        return f"Welcome to the Digital Library, {user}! 📖"

    @staticmethod
    def get_current_time():
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def sample_books():
        return [
            {"title": "Atomic Habits", "author": "James Clear"},
            {"title": "Deep Work", "author": "Cal Newport"},
            {"title": "Rich Dad Poor Dad", "author": "Robert Kiyosaki"}
        ]


# Demo run (only runs if file is executed directly)
if __name__ == "__main__":
    print(LibraryUtils.get_welcome_message("User"))
    print("Current Time:", LibraryUtils.get_current_time())
    print("Sample Books:", LibraryUtils.sample_books())