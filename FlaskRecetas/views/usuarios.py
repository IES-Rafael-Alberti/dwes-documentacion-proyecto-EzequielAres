import json

import flask_praetorian
from flask import request, abort, current_app

from flask_restx import abort, Resource, Namespace

from model import Usuario, db, UsuarioSchema

# namespace declaration
api_usuario = Namespace("Usuarios", "Manejo de usuario")


@api_usuario.route("/<user_id>")
class UsuarioController(Resource):

    def get(self, user_id):
        user = Usuario.query.get_or_404(user_id)
        return UsuarioSchema().dump(user)

    @flask_praetorian.auth_required
    def delete(self, user_id):
        user = Usuario.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()

        return f"Usuario {user_id} eliminado", 204

    @flask_praetorian.auth_required
    def put(self, user_id):
        data = request.values

        if (data['imagen'] != ""):
            if (data['hashed_password'] != ""):
                new_user = {"id": user_id, "nombre": data["nombre"], "nick": data["nick"], "email": data["email"],
                            "hashed_password": data["hashed_password"], "imagen": data["imagen"]}
            else:
                new_user = { "id" : user_id, "nombre" : data["nombre"], "nick" : data["nick"], "email" : data["email"],
                                                                                            "imagen" : data["imagen"] }

        elif (data['imagen'] == ""):
            imagen = request.files['nuevaImagen']

            carpeta = current_app.root_path
            imagen.save(carpeta + "/static/usuarios/" + imagen.filename)

            imagen_new_user = "http://localhost:5000/static/usuarios/" + imagen.filename

            if (data['hashed_password'] != ""):
                new_user = {"id": user_id, "nombre": data["nombre"], "nick": data["nick"], "email": data["email"],
                            "hashed_password": data["hashed_password"], "imagen": imagen_new_user}
            else:
                new_user = {"id": user_id, "nombre": data["nombre"], "nick": data["nick"], "email": data["email"],
                            "imagen": imagen_new_user}

        new_user = UsuarioSchema().load(new_user)

        if str(new_user.id) != user_id:
            abort(400, "no coincide el id")

        if (data["hashed_password"] != ""):
            guard = flask_praetorian.Praetorian()
            guard.init_app(current_app, Usuario)
            new_user.hashed_password = guard.hash_password(new_user.hashed_password)

        db.session.commit()

        return UsuarioSchema().dump(new_user)


@api_usuario.route("/")
class UsuarioListController(Resource):

    @flask_praetorian.auth_required
    def get(self):
        return UsuarioSchema(many=True).dump(Usuario.query.all())

    def post(self):
        data = request.values

        try:
            imagen = request.files['imagen']

            carpeta = current_app.root_path
            imagen.save(carpeta + "/static/usuarios/" + imagen.filename)

            imagen_new_user = "http://localhost:5000/static/usuarios/" + imagen.filename

            new_user = {"nombre": data["nombre"], "nick": data["nick"], "email": data["email"],
                        "hashed_password": data["hashed_password"], "imagen": imagen_new_user}
        except KeyError:
            imagen = "http://localhost:5000/static/usuarios/anon.jpg"

            new_user = {"nombre": data["nombre"], "nick": data["nick"], "email": data["email"],
                        "hashed_password": data["hashed_password"], "imagen": imagen}

        user = UsuarioSchema().load(new_user)

        guard = flask_praetorian.Praetorian()
        guard.init_app(current_app, Usuario)
        user.hashed_password = guard.hash_password(user.hashed_password)

        db.session.add(user)
        db.session.commit()
        return UsuarioSchema().dump(user), 201
