import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Recipe = () => {

  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/recipe/recipeNoche.scss');
      require('../css/recipe/recipeResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/recipe/recipe.scss');
      require('../css/recipe/recipeResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  library.add(faSearch, faHeart, faTrash);

  const navigate = useNavigate();


  const [tieneLike, setTieneLike] = React.useState(false);
  const [searchParams] = useSearchParams();
  const [receta, setReceta] = React.useState({});
  const [esVideo, setEsVideo] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [idLike, setIdLike] = React.useState("");
  const [ingredientes, setIngredientes] = React.useState([]);
  const [idReceta, setIdReceta] = React.useState(searchParams.get("id"));
  const [error, setError] = React.useState(null);


  const [comentariosPadre, setComentariosPadre] = React.useState([]);
  const [comentariosHijo, setComentariosHijo] = React.useState([]);
  const [contenidoComentario, setContenidoComentario] = React.useState("");
  const [imagenComentario, setImagenComentario] = React.useState("");


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


  function getExtension(file) {
    var parts = file.split('.');
    return parts[parts.length - 1];
  }

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



  function procesarDatos(e, esHijo, padreId) {
    e.preventDefault();

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

  async function quitarLike() {
    try {

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

  async function obtenerComentarios() {
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
  window.addEventListener('load', obtenerComentarios);
  window.addEventListener('load', obtenerIngredientes);


  return (
    <main>
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


      <footer className='Recipe__main__footer'>
        <section className='Recipe__main__footer__contenedor1'>
          <a href='/'>Cookpedia</a>
          <div className='Recipe__main__footer_contenedor1__rrss'>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg></a>
          </div>
        </section>
        <section className='Recipe__main__footer_contenedor2 desktop'>
          <a href=""><span>Legal disclaimer</span></a>
          <a href=""><span>Cookies</span></a>
          <a href=""><span>Privacy</span></a>
          <a href=""><span>Terms and conditions</span></a>
        </section>
      </footer>
    </main>
  )
}
