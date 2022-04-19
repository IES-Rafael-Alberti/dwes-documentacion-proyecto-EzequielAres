import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace
from sqlalchemy import desc, asc

import app
from model import db, Comentario, ComentarioSchema

# namespace declaration
api_comentario = Namespace("Comentarios", "Manejo de comentario")


@api_comentario.route("/<comentario_id>")
class ComentarioController(Resource):

    @flask_praetorian.auth_required
    def get(self, comentario_id):
        comentario = Comentario.query.get_or_404(comentario_id)
        return ComentarioSchema().dump(comentario)

    # @flask_praetorian.roles_required("admin")
    def delete(self, comentario_id):
        comentario = Comentario.query.get_or_404(comentario_id)
        db.session.delete(comentario)
        db.session.commit()

        return f"Comentario {comentario_id} eliminado", 204

    def put(self, comentario_id):
        new_comentario = ComentarioSchema().load(request.json)
        if str(new_comentario.id) != comentario_id:
            abort(400, "no coincide el id")

        db.session.commit()

        return ComentarioSchema().dump(new_comentario)

@api_comentario.route("/")
class ComentarioListController(Resource):

    @flask_praetorian.auth_required
    def get(self):
        return ComentarioSchema(many=True).dump(Comentario.query.all())

    # @flask_praetorian.roles_required("admin")
    def post(self):
        comentario = ComentarioSchema().load(request.json)

        db.session.add(comentario)
        db.session.commit()
        return ComentarioSchema().dump(comentario), 201
