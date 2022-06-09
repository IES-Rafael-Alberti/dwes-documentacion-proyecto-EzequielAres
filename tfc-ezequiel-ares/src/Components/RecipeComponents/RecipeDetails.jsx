import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const RecipeDetails = () => {


    const [tieneLike, setTieneLike] = React.useState(false);
    const [searchParams] = useSearchParams();
    const [receta, setReceta] = React.useState({});
    const [esVideo, setEsVideo] = React.useState(false);
    const [likes, setLikes] = React.useState(0);
    const [idLike, setIdLike] = React.useState("");
    const [ingredientes, setIngredientes] = React.useState([]);
    const [idReceta, setIdReceta] = React.useState(searchParams.get("id"));
    const [error, setError] = React.useState(null);

    library.add(faSearch, faHeart, faTrash);
    const navigate = useNavigate();

    // Función para saber si el usuario ha hecho like a la receta, guardamos también el id de ese like
    async function obtenerTieneLike() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/like/tiene/${idReceta}/${localStorage.getItem("id")}`);
            const resJson = await res.json();

            setIdLike(resJson.idLike);
            setTieneLike(resJson.result);
        } catch (error) {
            console.log("errorObtenerTieneLike")
        }
    }

    useEffect(() => {
        obtenerTieneLike();
    }, [tieneLike])

    // Función para crear like
    async function hacerLike() {
        try {
            let settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    "usuario": localStorage.getItem("id"),
                    "receta": idReceta
                })
            };

            const res = await fetch(`http://127.0.0.1:5000/api/like/`, settings);
            const resJson = await res.json();

            setTieneLike(true);
            setError(null);
            obtenerReceta();

        } catch (error) {
            console.log("errorGuardarComentario")
        }
    }

    // Función para quitar el like a la receta
    async function quitarLike() {
        try {

            if (receta.id_usuario == localStorage.getItem("id")) {
                return;
            }

            let settings = {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem("jwt") }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/like/${idLike}`, settings);

            if (res.status == 204) {
                setTieneLike(false);
                setError(null);
                obtenerReceta();
            }

        } catch (error) {
            console.log("errorGuardarComentario")
        }
    }

    // Función para borrar la receta
    async function deleteRecipe() {
        try {

            let settings = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/receta/${idReceta}`, settings);

            navigate("/recipes");

        } catch (error) {
            console.log("errorEliminarReceta")
        }
    }

    // Función para obtener la receta
    async function obtenerReceta() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/receta/${idReceta}`);
            const resJson = await res.json();
            let result = {};

            if (!resJson.video == undefined || !resJson.video == "") {
                result["video"] = resJson.video;
                setEsVideo(true);
            }

            result["nombre"] = resJson.nombre;
            result["descripcion"] = resJson.descripcion;
            result["pasos"] = resJson.pasos;
            result["imagen"] = resJson.imagen;
            result["video"] = resJson.video;
            result["nombreUsuario"] = resJson.nombreUsuario;
            result["id_usuario"] = resJson.id_usuario;

            setLikes(resJson.likes);
            setReceta(result);

        } catch (error) {
            console.log("errorObtenerRecetaRecipe");
        }
    }

    // Función para obtener los ingredientes de la receta
    async function obtenerIngredientes() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/recipe/${idReceta}`);
            const resJson = await res.json();
            const result = []

            for (let ingredient in resJson) {
                result.push(resJson[ingredient][0]);
            }

            setIngredientes(result);

        } catch (error) {
            console.log("errorObtenerRecetaRecipe");
        }
    }

    window.addEventListener('load', obtenerReceta);
    window.addEventListener('load', obtenerIngredientes);


    return (
        <section>
            <section className='Recipe__main__foto-video__contenedor'>
                {esVideo ? (
                    <video src={receta.video} autoPlay={true} muted={true} controls={true} loop={true}>
                        Tu navegador no soporta el formato de video
                    </video>
                ) : (
                    <img src={receta.imagen} alt="fotoReceta" />
                )}
            </section>


            <section className='Recipe__main__titulo__contenedor'>
                <span className='Recipe__main__titulo__contenedor__titulo'>{receta.nombre}</span>
                <div className='Recipe__main__titulo__contenedor__usuarioLikes'>
                    <span>{receta.nombreUsuario}</span>
                    <div className='Recipe__main__titulo__contenedor__usuarioLikes__contenedor'>
                        <span>{likes}</span>
                        {
                            tieneLike ? (
                                <FontAwesomeIcon onClick={quitarLike} icon='fa-solid fa-heart' size='sm' className='Recipes__main__titulo__contenedor__usaurioLikes__icono' />
                            ) :
                                (
                                    <svg onClick={hacerLike} className='Recipes__main__titulo__contenedor__usaurioLikes__icono' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" /></svg>
                                )
                        }
                        {
                            receta.id_usuario == localStorage.getItem("id") || localStorage.getItem("admin") == "true" ? (
                                <button onClick={deleteRecipe} className='Recipe__main__titulo__contenedor__usuarioLikes__contenedor__delete'><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
                            ) : (
                                <span></span>
                            )
                        }
                    </div>
                </div>
            </section>


            <section className='Recipe__main__contenido__contenedor'>
                <div className='Recipe__main__contenido__contenedor__descripcion'>
                    <span>{receta.descripcion}</span>
                </div>
                <div className='Recipe__main__contenido__contenedor__ingredientes'>
                    <span>Ingredients</span>

                    <ul className='Recipe__main__contenido__contenedor__ingredientes__list'>
                        {
                            ingredientes.map(item => (
                                <li key={item.id}>{item.nombre}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className='Recipe__main__contenido__contenedor__pasos'>
                    <span className='Recipe__main__contenido__contenedor__pasos__titulo'>Directions</span>
                    <span>{receta.pasos}</span>

                </div>
            </section>
        </section>
    )
}
