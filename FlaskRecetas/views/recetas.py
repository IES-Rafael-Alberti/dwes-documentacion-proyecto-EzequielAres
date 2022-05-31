import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace

from model import Receta, db, RecetaSchema

# namespace declaration
api_receta = Namespace("Recetas", "Manejo de receta")


@api_receta.route("/<recipe_id>")
class RecetaController(Resource):

    def get(self, recipe_id):

        query = sqlalchemy.text('SELECT r.id, r.nombre, r.descripcion, r.imagen, r.video, r.pasos, count(l.id) '
                                'as likis, u.nombre as nombreUsuario FROM receta r, like l, usuario u '
                                'WHERE r.id = :recipe_idRequest AND r.id = l.receta_id AND r.id_usuario = u.id GROUP BY r.id;')

        result = db.session.execute(query, {"recipe_idRequest": recipe_id})
        resultMapping = result.mappings().all()
        r = resultMapping[0]

        if (r["video"] != None):
            if (r["pasos"] != None):
                recipe = {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                        r["nombreUsuario"], "descripcion" : r["descripcion"], "video":r["video"], "pasos" : r["pasos"]}
            else:
                recipe = {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                        r["nombreUsuario"], "descripcion": r["descripcion"], "video": r["video"]}
        else:
            if (r["pasos"] != None):
                recipe = {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                        r["nombreUsuario"], "descripcion": r["descripcion"], "pasos" : r["pasos"]}
            else:
                recipe = {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                        r["nombreUsuario"], "descripcion": r["descripcion"]}

        return recipe

    @flask_praetorian.auth_required
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

    def get(self):
        return RecetaSchema(many=True).dump(Receta.query.all())

    @flask_praetorian.auth_required
    def post(self):
        receta = RecetaSchema().load(request.json)
        db.session.add(receta)
        db.session.commit()
        return RecetaSchema().dump(receta), 201

@api_receta.route("/list")
class RecetaListController(Resource):

    def get(self):
        order = request.args.get('order')

        if (order == "date"):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as '
                                    'nombreUsuario FROM receta r, like l, usuario u WHERE r.id = l.receta_id '
                                    'AND u.id = r.id_usuario group by r.id order by r.id desc')

            result = db.session.execute(query)
            resultMapping = result.mappings().all()


            recipes = {r["id"]: [
                {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                    r["nombreUsuario"]}] for r in resultMapping}

        elif (order == "likes"):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as '
                                    'nombreUsuario FROM receta r, like l, usuario u WHERE r.id = l.receta_id '
                                    'AND u.id = r.id_usuario group by r.id order by likis desc')

            result = db.session.execute(query)
            resultMapping = result.mappings().all()

            recipes = {r["nombre"]: [
                {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                    r["nombreUsuario"]}] for r in resultMapping}

        return recipes

@api_receta.route("/count")
class RecetaListController(Resource):
    def get(self):
        count = Receta.query.count()
        return count

@api_receta.route("/search/<string:name>")
class RecetaController(Resource):
    def get(self, name):
        order = request.args.get('order')
        name = '%' + name + '%'

        if (order == "date"):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as '
                                    'nombreUsuario FROM receta r, like l, usuario u WHERE r.id = l.receta_id ' +
                                    'AND u.id = r.id_usuario AND r.nombre LIKE :nameRequest group by r.id order by r.id desc')
            result = db.session.execute(query, {"nameRequest": name})
            resultMapping = result.mappings().all()

            recipes = {r["id"]: [
                {"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                    r["nombreUsuario"]}] for r in resultMapping}
        elif (order == "likes"):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as '
                                    'nombreUsuario FROM receta r, like l, usuario u WHERE r.id = l.receta_id ' +
                                    'AND u.id = r.id_usuario AND r.nombre LIKE :nameRequest group by r.id order by likis desc')


            result = db.session.execute(query, {"nameRequest": name})
            resultMapping = result.mappings().all()

            recipes = {r["nombre"]: [{"id": r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario":
                    r["nombreUsuario"]}] for r in resultMapping}

        return recipes

@api_receta.route("/home")
class RecetaController(Resource):

        def get(self):
            query = sqlalchemy.text('SELECT r.id, r.nombre as nombre, r.imagen, count(l.id) as likis, u.nombre as nombreUsuario FROM receta r, like l, ' +
                                    'usuario u WHERE r.id = l.receta_id AND u.id = r.id_usuario AND r.id BETWEEN 0 AND 6 ' +
                                    'group by r.id order by r.id desc')

            result = db.session.execute(query)
            resultMapping = result.mappings().all()


            return {r["id"]: [{"id" : r["id"], "nombre": r["nombre"], "imagen": r["imagen"], "likes": r["likis"], "nombreUsuario" :
                r["nombreUsuario"]}] for r in resultMapping}
