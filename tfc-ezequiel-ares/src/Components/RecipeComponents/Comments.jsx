import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';


export const Comments = () => {

    library.add(faSearch, faHeart, faTrash);
    const [searchParams] = useSearchParams();

    const [comentariosPadre, setComentariosPadre] = React.useState([]);
    const [comentariosHijo, setComentariosHijo] = React.useState([]);
    const [contenidoComentario, setContenidoComentario] = React.useState("");
    const [imagenComentario, setImagenComentario] = React.useState("");
    const [error, setError] = React.useState(null);
    const [idReceta, setIdReceta] = React.useState(searchParams.get("id"));

    // Función para obtener la extensión de la imagen
    function getExtension(file) {
        var parts = file.split('.');
        return parts[parts.length - 1];
    }

    // Función comprobar que la extensión de la imagen es correcta
    function checkImage() {
        let ext = getExtension(imagenComentario[0].name);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'bmp':
            case 'png':
                return;
        }
        setError("Wrong type for image");
        return;
    }

    // Función que comprueba los diferentes datos del formulario
    function procesarDatos(e, esHijo, padreId) {
        e.preventDefault();

        if (localStorage.getItem("id") == undefined) {
            setError("Must be logged in!!");
            return;
        }
        if (contenidoComentario == "") {
            setError("Empty content");
            return
        }
        if (!imagenComentario == "") {
            checkImage();
        }

        setError(null);

        if (esHijo) {
            guardarComentarioHijo(padreId);
        } else {
            guardarComentario();
        }
    }

    // Función para crear un comentario
    async function guardarComentario() {
        try {
            const formData = new FormData();
            formData.append('usuario_id', localStorage.getItem("id"));
            formData.append('receta_id', idReceta);
            formData.append('contenido', contenidoComentario);
            formData.append('padre_id', "");
            formData.append('imagen', imagenComentario);

            if (imagenComentario != "") {
                formData.append('imagenFile', imagenComentario[0]);
            }

            let settings = {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/comentario/`, settings);
            const resJson = await res.json();

            setContenidoComentario("");
            setImagenComentario("");
            setError("");

            obtenerComentarios();

        } catch (error) {
            console.log("errorGuardarComentario")
        }
    }

    // Función para crear un comentario hijo
    async function guardarComentarioHijo(idPadre) {
        try {
            const formData = new FormData();
            formData.append('usuario_id', localStorage.getItem("id"));
            formData.append('receta_id', idReceta);
            formData.append('contenido', contenidoComentario);
            formData.append('padre_id', idPadre);
            formData.append('imagen', imagenComentario);

            if (imagenComentario != "") {
                formData.append('imagenFile', imagenComentario[0]);
            }

            let settings = {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/comentario/`, settings);
            const resJson = await res.json();

            setContenidoComentario("");
            setImagenComentario("");
            setError("");

            obtenerComentarios();

        } catch (error) {
            console.log("errorGuardarComentarioHijo")
        }
    }

    // Función para borrar un comentario
    async function deleteComment(id) {
        try {

            let settings = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/comentario/${id}`, settings);
            const resJson = await res.json();

            setError("");
            obtenerComentarios();

        } catch (error) {
            console.log("errorEliminarComentario")
        }
    }

    // Función para obtener todos los comentarios
    async function obtenerComentarios() {

        // Para empezar hacemos una petición obteniendo todos los comentarios padres
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/comentario/padre/${idReceta}`);
            const resJson = await res.json();
            const resultado = [];

            for (const comentario in resJson) {
                resultado.unshift(resJson[comentario][0]);
            }

            setComentariosPadre(resultado);

        } catch (error) {
            console.log("errorObtenerComentariosPadre")
        }

        // Luego obtenemos todos los comentarios que nos hijos de otros
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/comentario/hijo/${idReceta}`);
            const resJson = await res.json();
            const resultado = [];

            for (const comentario in resJson) {
                resultado.unshift(resJson[comentario][0]);
            }

            setComentariosHijo(resultado);

        } catch (error) {
            console.log("errorObtenerComentariosHijo")
        }
    }

    window.addEventListener('load', obtenerComentarios);

    return (
        <section>
            <section className='Recipe__main__formularioComentario'>
                <span className='Recipe__main__formularioComentario__titulo'>Comments</span>
                <form onSubmit={(e) => procesarDatos(e, false)}>
                    <fieldset id='desktop'>
                        <label htmlFor="image">
                            Image
                        </label>
                        <input type="file" name="Imagen" onChange={e => setImagenComentario(e.target.files)} />
                        {
                            error ? (
                                <p className='error'> {error} </p>
                            ) : (<p></p>)
                        }
                        <input type="submit" value="Save" />
                    </fieldset>
                    <label htmlFor="contenido" id='titulo'>
                        <textarea rows="5" cols="60" onChange={e => setContenidoComentario(e.target.value)} name="contenido" placeholder='Insert your comment here...' />
                    </label>
                    <fieldset id='movil'>
                        <label htmlFor="image">
                            Image
                        </label>
                        <input type="file" name="Imagen" onChange={e => setImagenComentario(e.target.files)} />
                        {
                            error ? (
                                <p className='error'> {error} </p>
                            ) : (<p></p>)
                        }
                        <input type="submit" value="Save" />
                    </fieldset>
                </form>
            </section>

            <section className='Recipe__main__comentarios'>
                {
                    comentariosPadre.map(item => (
                        <div className='Recipe__main__comentarios__comentario' key={item.id}>
                            <div className='Recipe__main__comentarios__comentario__contenedorUser'>
                                <div className='Recipe__main__comentarios__contenedorImagen'>
                                    <img src={item.imagenUsuario} alt="userImage" />
                                </div>
                                <span>{item.nombreUsuario}</span>

                                {
                                    item.usuario_id == localStorage.getItem("id") || localStorage.getItem("admin") == "true" ? (
                                        <button onClick={(e) => deleteComment(item.id)} className='Recipe__main__comentarios__comentario__contenedorUser__delete'><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
                                    ) : (
                                        <span></span>
                                    )
                                }
                            </div>
                            <div className='Recipe__main__comentarios__comentario__imagen'>
                                {
                                    item.imagen != null ? (
                                        <img src={item.imagen} alt="commentImage" />
                                    ) : (<span></span>)
                                }
                            </div>
                            <span className='Recipe__main__comentarios__comentario__contenido'>{item.contenido}</span>
                            <hr className='lineaPadre' />


                            {
                                comentariosHijo.map(hijo => (
                                    hijo.padre_id == item.id ? (
                                        <div className='Recipe__main__comentarios__comentario--hijo' key={hijo.id}>
                                            <div className='Recipe__main__comentarios__comentario__contenedorUser--hijo'>
                                                <div className='Recipe__main__comentarios__contenedorImagen'>
                                                    <img src={hijo.imagenUsuario} alt="userImage" />
                                                </div>
                                                <span>{hijo.nombreUsuario}</span>
                                                {
                                                    hijo.usuario_id == localStorage.getItem("id") || localStorage.getItem("admin") == "true" ? (
                                                        <button onClick={(e) => deleteComment(hijo.id)} className='Recipe__main__comentarios__comentario__contenedorUser__delete'><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
                                                    ) : (
                                                        <span></span>
                                                    )
                                                }
                                            </div>
                                            <div className='Recipe__main__comentarios__comentario__imagen--hijo'>
                                                {
                                                    hijo.imagen != null ? (
                                                        <img src={hijo.imagen} alt="childCommentImage" />
                                                    ) : (<span></span>)
                                                }
                                            </div>
                                            <span className='Recipe__main__comentarios__comentario__contenido--hijo'>{hijo.contenido}</span>
                                            <hr className='lineaHijo' />

                                        </div>
                                    ) : (
                                        <div key={hijo.id}></div>
                                    )
                                ))
                            }


                            <form onSubmit={(e) => procesarDatos(e, true, item.id)} className='Recipe__main__comentarios__comentario__formulario'>
                                <fieldset>
                                    <label htmlFor="contenido" id='contenido'>
                                        <textarea rows="5" cols="60" onChange={e => setContenidoComentario(e.target.value)} name="contenido" placeholder='Insert your comment here...' />
                                    </label>
                                    {
                                        error ? (
                                            <p className='error'> {error} </p>
                                        ) : (<p></p>)
                                    }
                                    <label htmlFor="image">
                                        Image
                                    </label>
                                    <input type="file" name="Imagen" onChange={e => setImagenComentario(e.target.files)} />
                                    <input type="submit" value="Save" />
                                </fieldset>
                            </form>


                        </div>
                    ))
                }
            </section>
        </section>
    )
}
