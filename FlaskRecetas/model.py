from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy_utils import database_exists
#from flask import Blueprint
#import requests

# instantiate SQLAlchemy object
import commands

db = SQLAlchemy()





def init_db(app, guard, testing=False):
    """
    Initializes database

    :param testing:
    :param app: flask app
    :param guard: praetorian object for password hashing if seeding needed
    """
    db.init_app(app)
    if testing or not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        # if there is no database file
        # migrate model
        db.create_all(app=app)
        # seed data
        seed_db(app, guard)


def seed_db(app, guard):
    with app.app_context():
        recetas = commands.recipe()

        usuarios = [
            Usuario(nombre="Ezequiel", nick="Zzequi", email="ezequiel@gmail.com",
                    hashed_password=guard.hash_password("pestillo"), imagen="/static/imagenes/usuario/anon.jpg",
                    is_admin=True),
            Usuario(nombre="Ana", nick="Anita", email="ana@gmail.com",
                    hashed_password=guard.hash_password("pestillo"), imagen="/static/imagenes/usuario/anon.jpg",
                    is_admin=False),
            Usuario(nombre="Paco", nick="Pakito", email="paco@gmail.com",
                    hashed_password=guard.hash_password("pestillo"), imagen="/static/imagenes/usuario/anon.jpg",
                    is_admin=True),
            Usuario(nombre="María", nick="Marieta", email="maria@gmail.com",
                    hashed_password=guard.hash_password("pestillo"), imagen="/static/imagenes/usuario/anon.jpg",
                    is_admin=False),
            Usuario(nombre="Alejandro", nick="Alex", email="alex@gmail.com",
                    hashed_password=guard.hash_password("pestillo"), imagen="/static/imagenes/usuario/anon.jpg",
                    is_admin=True)
        ]

        recetasSeeder = []

        for i in range(0, len(recetas)):
            ingredientes = []


            for x in range(0, len(recetas[i]["ingredientes"])):

                mi_ingrediente = Ingrediente.query.filter_by(nombre=recetas[i]["ingredientes"][x]["nombre"]).first()
                if mi_ingrediente == None:
                    mi_ingrediente = Ingrediente(nombre=recetas[i]["ingredientes"][x]["nombre"])
                    db.session.add(mi_ingrediente)
                ingredientes.append(
                    mi_ingrediente
                )

            if len(recetas[i]["pasos"]) == 0:
               recetas[i]["pasos"] = None

            recetas[i]["tags"] = ",".join(recetas[i]["tags"])

            recetasSeeder.append(
                Receta(nombre=recetas[i]["nombre"], descripcion=recetas[i]["descripcion"], imagen=recetas[i]["imagen"],
                       tags=recetas[i]["tags"], video=recetas[i]["video"], pasos=recetas[i]["pasos"], ingredientes=ingredientes)
            )

        comentarios = [
            Comentario(usuario_id=0, receta_id=0, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=1, receta_id=0, padre_id=0, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=2, receta_id=0, padre_id=0, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=0, receta_id=1, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=3, receta_id=1, padre_id=3, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=0, receta_id=0, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=2, receta_id=2, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=0, receta_id=2, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=3, receta_id=3, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
            Comentario(usuario_id=1, receta_id=2, imagen="/static/imagenes/comentario/anon.jpg",
                       contenido="lorem ipsum"),
        ]

        likes = [
            Like(usuario_id=0, receta_id=0),
            Like(usuario_id=1, receta_id=0),
            Like(usuario_id=2, receta_id=0),
            Like(usuario_id=0, receta_id=1),
            Like(usuario_id=1, receta_id=1),
            Like(usuario_id=2, receta_id=2),
            Like(usuario_id=3, receta_id=2),
            Like(usuario_id=0, receta_id=3),
            Like(usuario_id=1, receta_id=4),
            Like(usuario_id=2, receta_id=4),
        ]

        # add data from lists
        for usuario in usuarios:
            db.session.add(usuario)
        for receta in tuple(recetasSeeder):
            db.session.add(receta)
        for comentario in comentarios:
            db.session.add(comentario)
        for like in likes:
            db.session.add(like)
        # commit changes in database
        db.session.commit()


class Usuario(db.Model):
    """
    User entity

    Store user data
    """
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)
    nick = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    imagen = db.Column(db.String(150), unique=False, nullable=False)

    hashed_password = db.Column(db.Text)

    is_admin = db.Column(db.Boolean, default=False, server_default="false")
    is_active = db.Column(db.Boolean, default=True, server_default="true")

    @property
    def identity(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has an ``identity`` instance
        attribute or property that provides the unique id of the user instance
        """
        return self.id

    @property
    def rolenames(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``rolenames`` instance
        attribute or property that provides a list of strings that describe the roles
        attached to the user instance
        """
        return "admin" if self.is_admin else "user"

    @property
    def password(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``password`` instance
        attribute or propelikes = db.Table('like',
                 db.Column('receta_id', db.Integer, db.ForeignKey('receta.id'), primary_key=True),
                 db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True)
                 )rty that provides the hashed password assigned to the user
        instance
        """

        return self.hashed_password

    @classmethod
    def lookup(cls, nombre):
        """
        *Required Method*

        flask-praetorian requires that the user class implements a ``lookup()``
        class method that takes a single ``username`` argument and returns a user
        instance if there is one that matches or ``None`` if there is not.
        """
        return cls.query.filter_by(nombre=nombre).one_or_none()

    @classmethod
    def identify(cls, id_user):
        """
        *Required Method*

        flask-praetorian requires that the user class implements an ``identify()``
        class method that takes a single ``id`` argument and returns user instance if
        there is one that matches or ``None`` if there is not.
        """
        return cls.query.get(id_user)

    def is_valid(self):
        return self.is_active

    # specify string for repr
    def __repr__(self):
        return f"<Usuario {self.nombre}>"


# ingrediente_receta = db.Table('ingrediente_receta',
#                               db.Column('receta_id', db.Integer, db.ForeignKey('receta.id'), primary_key=True),
#                               db.Column('ingrediente_id', db.Integer, db.ForeignKey('ingrediente.id'), primary_key=True)
#                               )

class IngredienteReceta(db.Model):
    __tablename__ = 'ingrediente_receta'
    receta_id = db.Column(ForeignKey('receta.id'), primary_key=True)
    ingrediente_id = db.Column(ForeignKey('ingrediente.id'), primary_key=True)
    cantidad = db.Column(db.String(200), unique=False, nullable=False)

    ingrediente = relationship("Ingrediente", back_populates="recetas")
    receta = relationship("Receta", back_populates="ingredientes")

#    receta = relationship("Receta", backref=backref("ingrediente_receta", cascade="all, delete-orphan"))
#    ingrediente = relationship("Ingrediente", backref=backref("ingrediente_receta", cascade="all, delete-orphan"))

class Receta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)
    descripcion = db.Column(db.String(200), unique=False, nullable=False)
    imagen = db.Column(db.String(150), unique=False, nullable=False)
    video = db.Column(db.String(200), unique=False, nullable=True)
    pasos = db.Column(db.String(300), unique=False, nullable=True)
    tags = db.Column(db.String(150), unique=False, nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=True)

    usuario = relationship("Usuario", backref="recetas")

    ingredientes = relationship("IngredienteReceta", back_populates="receta")
#    ingredientes = db.relationship('Ingrediente', secondary=IngredienteReceta)

    is_active = db.Column(db.Boolean, default=True, server_default="true")

    def __repr__(self):
        return f"<Receta {self.nombre}>"


class Ingrediente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=False, nullable=False)

    recetas = relationship("IngredienteReceta", back_populates="ingrediente")

#    recetas = relationship("Receta", secondary=IngredienteReceta)

    def __repr__(self):
        return f"<Ingrediente {self.nombre}>"


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    receta_id = db.Column(db.Integer, db.ForeignKey('receta.id'))


class Comentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    receta_id = db.Column(db.Integer, db.ForeignKey('receta.id'))
    padre_id = db.Column(db.Integer, db.ForeignKey('comentario.id'), nullable=True)
    imagen = db.Column(db.String(150), unique=False, nullable=False)
    contenido = db.Column(db.String(250), unique=False, nullable=False)


class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        include_relationships = True
        load_instance = True
        sqla_session = db.session


class RecetaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Receta
        include_relationships = True
        load_instance = True
        sqla_session = db.session


class IngredienteSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Ingrediente
        include_relationships = True
        load_instance = True
        sqla_session = db.session


class LikeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Like
        include_relationships = True
        load_instance = True
        sqla_session = db.session


class ComentarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comentario
        include_relationships = True
        load_instance = True
        sqla_session = db.session
