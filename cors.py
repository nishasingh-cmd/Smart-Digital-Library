"""
CORS Configuration Module
-------------------------
Handles Cross-Origin Resource Sharing for the application.
"""

from flask_cors import CORS


def configure_cors(app):
    """
    Enable CORS for the Flask app
    """
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True
    )

    return app