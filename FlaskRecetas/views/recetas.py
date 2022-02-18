import json

import flask_praetorian
from flask import Flask, render_template, jsonify, request, \
                  redirect, url_for, send_from_directory, session, \
                  abort, current_app

import sqlalchemy



from flask_restx import abort, Resource, Namespace

import app
from model import Usuario, db, UsuarioSchema

# namespace declaration
api_receta = Namespace("Recetas", "Manejo de receta")
