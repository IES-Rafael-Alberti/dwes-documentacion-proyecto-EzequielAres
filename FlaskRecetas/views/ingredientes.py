import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace

import app
from model import Ingrediente, db, IngredienteSchema

# namespace declaration
api_ingrediente = Namespace("Ingredientes", "Manejo de ingrediente")

@api_ingrediente.route("/<ingredient_id>")
class IngredienteController(Resource):

    @flask_praetorian.auth_required
    def get(self, ingredient_id):
        ingrediente = Ingrediente.query.get_or_404(ingredient_id)
        return IngredienteSchema().dump(ingrediente)

    #@flask_praetorian.roles_required("admin")
    def delete(self, ingredient_id):
        ingrediente = Ingrediente.query.get_or_404(ingredient_id)
        db.session.delete(ingrediente)
        db.session.commit()

        return f"Ingrediente {ingredient_id} eliminado", 204

    #@flask_praetorian.roles_required("admin")
    def put(self, ingredient_id):
        new_ingrediente = IngredienteSchema().load(request.json)
        if str(new_ingrediente.id) != ingredient_id:
            abort(400, "no coincide el id")

        db.session.commit()

        return IngredienteSchema().dump(new_ingrediente)


@api_ingrediente.route("/")
class IngredienteListController(Resource):

    @flask_praetorian.auth_required
    def get(self):
        return IngredienteSchema(many=True).dump(Ingrediente.query.all())

    #@flask_praetorian.roles_required("admin")
    def post(self):
        ingrediente = IngredienteSchema().load(request.json)

        db.session.add(ingrediente)
        db.session.commit()
        return IngredienteSchema().dump(ingrediente), 201
