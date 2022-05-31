"""
App configuration
"""
import os

###
# database configuration
SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.abspath(os.curdir)}/flask.db"
SQLALCHEMY_TRACK_MODIFICATIONS = False

###
# praetorian configuration
SECRET_KEY = "latch"
JWT_ACCESS_LIFESPAN = {"hours": 99999}
JWT_REFRESH_LIFESPAN = {"days": 99999}

###
# using environment variables
# import os
# GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
# GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
