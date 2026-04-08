"""
API Routes Module
----------------
Defines all API endpoints for the Digital Library.
"""

from flask import Blueprint, jsonify

api = Blueprint("api", __name__)


@api.route("/books", methods=["GET"])
def get_books():
    return jsonify([
        {"id": 1, "title": "Atomic Habits", "author": "James Clear"},
        {"id": 2, "title": "Deep Work", "author": "Cal Newport"},
        {"id": 3, "title": "Rich Dad Poor Dad", "author": "Robert Kiyosaki"},
    ])


@api.route("/categories", methods=["GET"])
def get_categories():
    return jsonify([
        "Fiction",
        "Business",
        "Psychology",
        "Technology"
    ])


@api.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "API running successfully 🚀"})