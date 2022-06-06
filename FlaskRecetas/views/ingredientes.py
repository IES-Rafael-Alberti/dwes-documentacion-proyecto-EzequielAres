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

    @flask_praetorian.auth_required
    def post(self):
        ingrediente = IngredienteSchema().load(request.json)

        db.session.add(ingrediente)
        db.session.commit()
        return IngredienteSchema().dump(ingrediente), 201

@api_ingrediente.route("/recipe/<recipe_id>")
class IngredienteListController(Resource):

    def get(self, recipe_id):
        query = sqlalchemy.text('SELECT i.id, i.nombre, ir.cantidad FROM ingrediente_receta ir, ingrediente i WHERE '
                                'ir.receta_id = :recipe_idRequest AND i.id IN (SELECT ingrediente_id FROM receta '
                                'WHERE id = :recipe_idRequest) GROUP BY i.id;')

        result = db.session.execute(query, {"recipe_idRequest": recipe_id})
        resultMapping = result.mappings().all()

        ingredients = {r["id"]: [{"id": r["id"], "nombre": r["nombre"] + ' - ' + r["cantidad"]}] for r in
                       resultMapping}

        return ingredients;

@api_ingrediente.route("/busqueda/<string:name>")
class IngredienteListController(Resource):

    def get(self, name):
        name = '%' + name + '%'

        query = sqlalchemy.text('SELECT * FROM ingrediente WHERE nombre LIKE :nameRequest;')

        result = db.session.execute(query, {"nameRequest": name})
        resultMapping = result.mappings().all()

        ingredients = {r["id"]: [{"id": r["id"], "nombre": r["nombre"]}] for r in
                       resultMapping}

        return ingredients;
