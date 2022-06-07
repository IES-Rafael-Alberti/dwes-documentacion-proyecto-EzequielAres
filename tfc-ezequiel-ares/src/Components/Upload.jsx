import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";


export const Upload = () => {

  library.add(faPlus);

  const [nombre, setNombre] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [imagen, setImagen] = React.useState("");
  const [video, setVideo] = React.useState("");
  const [pasos, setPasos] = React.useState("");
  const [busquedaIngrediente, setBusquedaIngrediente] = React.useState([]);
  const [ingredientes, setIngredientes] = React.useState([]);
  const [ingredientesPeticion, setIngredientesPeticion] = React.useState([]);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/upload/uploadNoche.scss');
      require('../css/upload/uploadResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/upload/upload.scss');
      require('../css/upload/uploadResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  // Comprueba si hemos iniciado sesion, si no redirige a login
  function comprobarLogin() {
    if (localStorage.getItem("jwt") == undefined) {
      navigate("/login");
    }
  }

  window.addEventListener('load', comprobarLogin);

  function eliminarHijosDataList(dataList) {

    var length = dataList.options.length - 1;

    for (let i = length; i >= 0; i--) {
      dataList.removeChild(dataList.children[i]);
    }
  }

  function crearDataList(listaIngredientes) {
    let dataList = document.getElementById("ingredientesLista");

    eliminarHijosDataList(dataList);

    for (let ingrediente in listaIngredientes) {
      let newIngredient = document.createElement("option");
      newIngredient.id = [ingrediente];
      newIngredient.value = listaIngredientes[ingrediente][0].nombre;
      dataList.appendChild(newIngredient);
    }
  }

  async function obtenerListaIngredientes() {
    try {
      if (busquedaIngrediente != "") {

        const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/busqueda/${busquedaIngrediente}`);
        const resJson = await res.json();

        crearDataList(resJson);
        return;
      }

    } catch {
      console.log("errorObtenerListaIngredientes");
    }
  }

  function comprobarIngredienteLista() {
    let nombreIngredienteNuevo = document.getElementById("ingredienteNuevo").value;
    let cantidadIngredienteNuevo = document.getElementById("cantidadIngredienteNuevo").value;

    if (nombreIngredienteNuevo == "" || cantidadIngredienteNuevo == "") {
      setError("Empty ingredient name or quantity");
      return false;
    }

    setError("");
    let ingrediente = {
      "nombre": nombreIngredienteNuevo,
      "cantidad": cantidadIngredienteNuevo
    };

    for (let i in ingredientes) {
      if (ingredientes[i].nombre == ingrediente.nombre) {
        setError("Already introduced this ingredient");
        return false;
      }
    }

    return true;
  }


  async function añadirIngredienteNuevoLista() {
    let nombreIngredienteNuevo = document.getElementById("ingredienteNuevo").value;
    let cantidadIngredienteNuevo = document.getElementById("cantidadIngredienteNuevo").value;

    if (comprobarIngredienteLista()) {
      try {

        const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/busqueda/${nombreIngredienteNuevo}`);
        const resJson = await res.json();

        if (Object.keys(resJson).length != 0) {

          let listaIngredientesPeticion = ingredientesPeticion;
          let listaIngredientes = ingredientes;
          let idResJsonObject = Object.keys(resJson)[0];


          let ingrediente = {
            "id": resJson[idResJsonObject][0]["id"],
            "nombre": resJson[idResJsonObject][0]["nombre"],
            "cantidad": cantidadIngredienteNuevo
          };


          let ingredientePeticion = {
            "ingrediente_id": resJson[idResJsonObject][0]["id"],
            "cantidad": cantidadIngredienteNuevo
          };


          listaIngredientes.push(ingrediente);
          setIngredientes(listaIngredientes);

          listaIngredientesPeticion.push(ingredientePeticion);
          setIngredientesPeticion(listaIngredientesPeticion);

        } else {
          let settings = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              "nombre": nombreIngredienteNuevo,
            })
          };

          const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/`, settings);
          const resJson = await res.json();

          let ingrediente = {
            "id": resJson.id,
            "nombre": resJson.nombre,
            "cantidad": cantidadIngredienteNuevo
          };


          let ingredientePeticion = {
            "ingrediente_id": resJson.id,
            "cantidad": cantidadIngredienteNuevo
          };

          let listaIngredientes = ingredientes;
          let listaIngredientesPeticion = ingredientesPeticion;

          listaIngredientes.push(ingrediente);
          listaIngredientesPeticion.push(ingredientePeticion);

          setIngredientes(listaIngredientes);
          setIngredientesPeticion(listaIngredientesPeticion);

        }

      } catch {
        console.log("errorAñadirIngredienteNuevo");
      }
    }

    return;

  }

  async function crearReceta() {
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('imagen', imagen[0]);
      formData.append('video', video[0]);
      formData.append('pasos', pasos);
      formData.append('id_usuario', localStorage.getItem("id"));
      formData.append('ingredientes', JSON.stringify(ingredientesPeticion));

      let settings = {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        }
      };

      const res = await fetch("http://127.0.0.1:5000/api/receta/", settings);
      const resJson = await res.json();

      navigate(`/recipe?id=${resJson.id}`);


    } catch (error) {
      console.log("ErrorCrearReceta");
    }
  }

  const procesarDatos = e => {
    e.preventDefault()

    if (!nombre.trim()) {
      setError("Empty recipe name");
      return
    }
    if (!descripcion.trim()) {
      setError("Empty recipe description");
      return
    }
    if (ingredientes == []) {
      setError("Empty recipe ingredients");
      return
    }
    if (video == "" && !pasos.trim()) {
      setError("You must upload a video if don't complete steps field");
      return
    }
    if (imagen == "") {
      setError("You must upload a image");
      return
    }
    if (!imagen == "") {
      checkImage();
    }
    if (!video == "") {
      checkVideo();
    }
    if (ingredientesPeticion.length == 0) {
      setError("You must add ingredients");
      return;
    }

    setError("");
    crearReceta();
  }

  function getExtension(file) {
    var parts = file.split('.');
    return parts[parts.length - 1];
  }

  function checkImage() {
    let ext = getExtension(imagen[0].name);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'bmp':
      case 'png':
        return;
    }
    setError("Wrong type for image");
    return;
  }

  function checkVideo() {
    let ext = getExtension(video[0].name);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
      case 'webm':
        return;
    }
    setError("Wrong type for video");
    return;
  }

  return (
    <main>
      <section className='Upload__main__contenedor'>
        <form onSubmit={procesarDatos} className="Upload__main__contenedor__formulario">
          <fieldset>
            <label htmlFor='Name'>
              Name
              <input type="text" name="Name" onChange={e => setNombre(e.target.value)} />
            </label>
            <label htmlFor='Descripcion'>
              Description
            </label>
            <textarea rows="5" cols="60" onChange={e => setDescripcion(e.target.value)} name="Descripcion" placeholder='Enter description here...' />
            <label htmlFor='Pasos'>
              Steps
            </label>
            <textarea rows="5" cols="60" onChange={e => setPasos(e.target.value)} name="Pasos" placeholder='Enter steps here...' />

            <div className='Upload__main__contenedor__formulario__ingredientes'>
              <label htmlFor="Ingredientes">
                Ingredients

                <input onChange={(e) => { setBusquedaIngrediente(e.target.value); obtenerListaIngredientes(); }} id='ingredienteNuevo' type="text" name='Ingredientes' list="ingredientesLista" />
              </label>
              <datalist id="ingredientesLista">
              </datalist>

              <label htmlFor="cantidad">
                <input type="text" placeholder='Quantity' id='cantidadIngredienteNuevo' name='cantidad' />
              </label>
              <button type='button' onClick={añadirIngredienteNuevoLista}><FontAwesomeIcon icon="fa-solid fa-plus" /></button>
            </div>

            <ul>
              {
                ingredientes.map(item => (
                  <li key={item.id}>{item.nombre} {item.cantidad}</li>
                ))
              }
            </ul>

            <label htmlFor='Imagen'>
              Image
              <input type="file" name='Imagen' onChange={e => setImagen(e.target.files)} />
            </label>
            <label htmlFor='Video'>
              Video
              <input type="file" name='Video' onChange={e => setVideo(e.target.files)} />

            </label>
          </fieldset>
          {
            error ? (
              <p className='error'> {error} </p>
            ) : (<p></p>)
          }
          <input type="submit" value="Save" />
        </form>
      </section>

      <footer className='Upload__main__footer'>
        <section className='Upload__main__footer__contenedor1'>
          <a href='/'><span>Cookpedia</span></a>
          <div className='Upload__main__footer_contenedor1__rrss'>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg></a>
          </div>
        </section>
        <section className='Upload__main__footer_contenedor2 desktop'>
          <a href=""><span>Legal disclaimer</span></a>
          <a href=""><span>Cookies</span></a>
          <a href=""><span>Privacy</span></a>
          <a href=""><span>Terms and conditions</span></a>
        </section>
      </footer>
    </main>
  )
}
