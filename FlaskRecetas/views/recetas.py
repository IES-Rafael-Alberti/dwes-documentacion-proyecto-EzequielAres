import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace
from sqlalchemy import desc, asc

import app
from model import Receta, db, RecetaSchema

# namespace declaration
api_receta = Namespace("Recetas", "Manejo de receta")


@api_receta.route("/<recipe_id>")
class RecetaController(Resource):

    @flask_praetorian.auth_required
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


def dumpRecipe(recipes):
    list = []

    for recipe in recipes:
        list.append(RecetaSchema().dump(recipe))

    return list

@api_receta.route("/")
class RecetaListController(Resource):

    def get(self):
        return RecetaSchema(many=True).dump(Receta.query.all())

    @flask_praetorian.auth_required
    @flask_praetorian.roles_required("admin")
    def post(self):
        receta = RecetaSchema().load(request.json)
        db.session.add(receta)
        db.session.commit()
        return RecetaSchema().dump(receta), 201

@api_receta.route("/pagination/<int:page_number>")
class RecetaListController(Resource):

    def get(self, page_number):
        per_page = 3

        recipes = Receta.query.order_by(desc(Receta.id)).paginate(page_number, per_page, error_out=False)

        pages = recipes.pages

        recipes = dumpRecipe(recipes.items)

        data = {"page_number" : page_number, "page_length" : pages, "items" : recipes}

        return data

@api_receta.route("/search/<string:name>")
class RecetaController(Resource):

    def get(self, name):
        order = request.args.get('order')
        name = '%' + name + '%'

        if (order == "date"):
            recipes = Receta.query.filter(Receta.nombre.like(name)).order_by(desc(Receta.id)).all()
        elif (order == "likes"):
            # TODO: Preparación sql query
            query = sqlalchemy.text('SELECT r.*, count(l.id) as likis FROM receta r, like l WHERE r.id = l.receta_id ' +
                                    'AND r.nombre LIKE "' +  name + '" group by r.id order by likis desc')

            result = db.session.execute(query)
            resultMapping = result.mappings().all()

            return {r["id"]: [{"nombre" : r["nombre"], "descripcion" : r["descripcion"], "imagen": r["imagen"],
                               "video": r["video"], "pasos" : r["pasos"], "tags" : r["tags"], "likes" : r["likis"]}] for r in resultMapping}


        return RecetaSchema(many=True).dump(recipes)

@api_receta.route("/home")
class RecetaController(Resource):

        def get(self):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as nombreUsuario FROM receta r, like l, ' +
                                    'usuario u WHERE r.id = l.receta_id AND u.id = l.usuario_id AND r.id BETWEEN 0 AND 6 ' +
                                    'group by r.id order by r.id desc')

            result = db.session.execute(query)
            resultMapping = result.mappings().all()


            return {r["id"]: [{"id" : r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario" :
                r["nombreUsuario"]}] for r in resultMapping}
