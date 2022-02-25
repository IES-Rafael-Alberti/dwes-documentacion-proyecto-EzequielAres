import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace

import app
from model import Receta, db, RecetaSchema

# namespace declaration
api_receta = Namespace("Recetas", "Manejo de receta")


@api_receta.route("/<recipe_id>")
class RecetaController(Resource):

    # @flask_praetorian.auth_required
    def get(self, recipe_id):
        receta = Receta.query.get_or_404(recipe_id)
        return RecetaSchema().dump(receta)

    # @flask_praetorian.roles_required("admin")
    def delete(self, recipe_id):
        receta = Receta.query.get_or_404(recipe_id)
        db.session.delete(receta)
        db.session.commit()

        return f"Receta {recipe_id} eliminada", 204

    def put(self, recipe_id):
        new_recipe = RecetaSchema().load(request.json)
        if str(new_recipe.id) != recipe_id:
            abort(400, "no coincide el id")

        db.session.commit()

        return RecetaSchema().dump(new_recipe)


@api_receta.route("/")
class RecetaListController(Resource):

    # @flask_praetorian.auth_required
    def get(self):
        return RecetaSchema(many=True).dump(Receta.query.all())

    # @flask_praetorian.roles_required("admin")
    def post(self):
        receta = RecetaSchema().load(request.json)

        guard = flask_praetorian.Praetorian()
        guard.init_app(current_app, Receta)
        receta.hashed_password = guard.hash_password(receta.hashed_password)

        db.session.add(receta)
        db.session.commit()
        return RecetaSchema().dump(receta), 201