import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace
from sqlalchemy import desc, asc

import app
from model import db, Like, LikeSchema

# namespace declaration
api_like = Namespace("Likes", "Manejo de like")


@api_like.route("/<like_id>")
class LikeController(Resource):

    @flask_praetorian.auth_required
    def get(self, like_id):
        like = Like.query.get_or_404(like_id)
        return LikeSchema().dump(like)

    # @flask_praetorian.roles_required("admin")
    def delete(self, like_id):
        like = Like.query.get_or_404(like_id)
        db.session.delete(like)
        db.session.commit()

        return f"Like {like_id} eliminado", 204

    def put(self, like_id):
        new_like = LikeSchema().load(request.json)
        if str(new_like.id) != like_id:
            abort(400, "no coincide el id")

        db.session.commit()

        return LikeSchema().dump(new_like)

@api_like.route("/")
class LikeListController(Resource):

    @flask_praetorian.auth_required
    def get(self):
        return LikeSchema(many=True).dump(Like.query.all())

    # @flask_praetorian.roles_required("admin")
    def post(self):
        like = LikeSchema().load(request.json)
        
        db.session.add(like)
        db.session.commit()
        return LikeSchema().dump(like), 201
