from flask import Flask, jsonify, request, url_for, render_template
from authlib.integrations.flask_client import OAuth
import flask_praetorian

from model import init_db

#import blueprint
from views import blueprint as api

def create_app(config_file='config.py'):
    # instantiate praetorian object
    guard = flask_praetorian.Praetorian()

    # instantiate flask app
    app = Flask(__name__)
    app.config['JSON_SORT_KEYS'] = False

    # get configuration parameters
    app.config.from_pyfile(config_file)

    # praetorian init
    #guard.init_app(app, User)

    # SQLAlchemy init
    init_db(app, guard, 'tests' in config_file)


    # register blueprint
    app.register_blueprint(api, url_prefix="/api/")

    @app.route("/")
    def home():
        """
        Home page

        Send static file with link to api to avoid 404 on /
        """
        return app.send_static_file("index.html")
    return app

if __name__ == '__main__':
    # starts app
    # in production: debug=False
    app.create_app()
    app.run(debug=True)
