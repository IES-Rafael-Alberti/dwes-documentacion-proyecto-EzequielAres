import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace

from model import Usuario, db, UsuarioSchema

# namespace declaration
api_usuario = Namespace("Usuarios", "Manejo de usuario")

@api_usuario.route("/<user_id>")
class UsuarioController(Resource):

    @flask_praetorian.auth_required
    def get(self, user_id):
        user = Usuario.query.get_or_404(user_id)
        return UsuarioSchema().dump(user)

    #@flask_praetorian.roles_required("admin")
    def delete(self, user_id):
        user = Usuario.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()

        return f"Usuario {user_id} eliminado", 204

    #@flask_praetorian.roles_required("admin")
    def put(self, user_id):
        new_user = UsuarioSchema().load(request.json)
        if str(new_user.id) != user_id:
            abort(400, "no coincide el id")

        db.session.commit()

        return UsuarioSchema().dump(new_user)


@api_usuario.route("/")
class UsuarioListController(Resource):

    @flask_praetorian.auth_required
    def get(self):
        return UsuarioSchema(many=True).dump(Usuario.query.all())

    #@flask_praetorian.roles_required("admin")
    def post(self):
        user = UsuarioSchema().load(request.json)

        guard = flask_praetorian.Praetorian()
        guard.init_app(current_app, Usuario)
        user.hashed_password = guard.hash_password(user.hashed_password)

        db.session.add(user)
        db.session.commit()
        return UsuarioSchema().dump(user), 201