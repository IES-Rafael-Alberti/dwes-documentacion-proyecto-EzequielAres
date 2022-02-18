from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from sqlalchemy_utils import database_exists

# instantiate SQLAlchemy object
db = SQLAlchemy()

def init_db(app, guard, testing=False):
    """
    Initializes database

    :param app: flask app
    :param guard: praetorian object for password hashing if seeding needed
    """
    db.init_app(app)
    if testing or not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        # if there is no database file
        # migrate model
        db.create_all(app=app)
        # seed data
        #seed_db(app, guard)


likes = db.Table('likes',
                db.Column('receta_id', db.Integer, db.ForeignKey('receta.id'), primary_key=True),
                db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key=True)
                )

class Usuario(db.Model):
    """
    User entity

    Store user data
    """
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)
    nick = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

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
        attribute or property that provides the hashed password assigned to the user
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


ingrediente_receta = db.Table('ingrediente_receta',
                                    db.Column('receta_id', db.Integer, db.ForeignKey('receta.id'), primary_key=True),
                                    db.Column('ingrediente_id', db.Integer, db.ForeignKey('ingrediente.id'), primary_key=True)
                                    )

class Receta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)
    descripcion = db.Column(db.String(200), unique=False, nullable=False)
    imagen = db.Column(db.String(150), unique=False, nullable=False)
    pasos = db.Column(db.String(300), unique=False, nullable=False)
    tags = db.Column(db.String(150), unique=False, nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))


    usuario = db.relationship("Usuario", backref=db.backref("receta", uselist=False))

    ingredientes = db.relationship('Ingrediente', secondary=ingrediente_receta)
    is_active = db.Column(db.Boolean, default=True, server_default="true")

    def __repr__(self):
        return f"<Receta {self.nombre}>"

class Ingrediente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), unique=True, nullable=False)

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
