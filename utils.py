"""
Utility Functions Module
------------------------
Contains helper functions used across the backend.
"""

import datetime


def current_timestamp():
    return datetime.datetime.now().isoformat()


def success_response(data, message="Success"):
    return {
        "status": "success",
        "message": message,
        "timestamp": current_timestamp(),
        "data": data
    }


def error_response(message="Something went wrong"):
    return {
        "status": "error",
        "message": message,
        "timestamp": current_timestamp()
    }