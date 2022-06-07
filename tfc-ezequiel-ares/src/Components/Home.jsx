import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { useNavigate } from 'react-router-dom';

export const Home = () => {

  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/index/indexNoche.scss');
      require('../css/index/indexResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/index/index.scss');
      require('../css/index/indexResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  library.add(faSearch, faHeart);

  const [recetas, setRecetas] = React.useState([]);
  const [busqueda, setBusqueda] = React.useState([]);
  const navigate = useNavigate();

  async function recetaAleatoria() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/receta/count");
      const resJson = await res.json();

      let idAleatorio = Math.floor(Math.random() * (resJson - 1)) + 1;

      let a = document.getElementById("botonRecetaAleatoria");
      a.href = `/recipe?id=${idAleatorio}`;

    } catch (error) {
      console.log("error");
    }
  }

  window.addEventListener('load', recetaAleatoria);

  async function obtenerRecetasHome() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/receta/home");
      const resJson = await res.json();
      const resultado = [];

      debugger
      for (const receta in resJson) {
        resultado.unshift(resJson[receta][0]);
      }

      setRecetas(resultado);
    } catch (error) {
      console.log("error")
    }
  };

  window.addEventListener('load', obtenerRecetasHome, 1);


  const buscar = e => {
    e.preventDefault();

    navigate(`recipes/?name=${busqueda}&order=date`);
  }

  function comprobarAncho() {
    let width = window.matchMedia("(max-width: 476px)");
    let video = document.getElementById("videoTitulo");

    if (width.matches) {
      if (video.src == "http://localhost:3000/videoIndex--movil.webm") {
        return;
      }

      video.removeAttribute("src");
      video.setAttribute("src", "videoIndex--movil.webm");
      video.load();
      video.play();
      return;
    } else {
      if (video.src == "http://localhost:3000/videoIndex.webm") {
        return;
      }
      video.removeAttribute("src");
      video.setAttribute("src", "videoIndex.webm");
      video.load();
      video.play();
      return;
    }
  }

  function establecerIntervalo() {
    let intervaloAncho = window.setInterval(comprobarAncho, 100);
  }

  window.addEventListener('load', establecerIntervalo, 1);


  return (
    <main className='main'>


      <section className='main__intro'>

        <video className='main__intro__video' id='videoTitulo' src="videoIndex.webm" autoPlay={true} muted={true} loop={true}>
          Tu navegador no soporta el formato de video
        </video>

        <div className='main__intro__titulo'>
          <h1 className='main__intro__titulo_texto'>Looking recipes?</h1>
        </div>

      </section>


      <section className='main__buscador'>

        <span className='main__buscador__texto'>Search</span>

        <form>
          <div className='main__buscador__contenedor'>
            <input onSubmit={buscar} type="text" className="main__buscador__contenedor__input" onChange={e => setBusqueda(e.target.value)} />
            <button onClick={buscar} className='main__buscador__contenedor__icono'><FontAwesomeIcon icon='fa fa-search' size='xl' /></button>
          </div>
        </form>

      </section>


      <section className='main__lastrecipes'>

        <div className='main__lastrecipes__titulo'>
          <span>Last recipes</span>
          <a href='/recipes' className='desktop'>View more...</a>
        </div>


        <section className='main__lastrecipes__recetas'>
          {
            recetas.map(item => (
              <div className='main__lastrecipes__recetas__receta' key={item.id}>

                <a href={`/recipe?id=${item.id}`}><img src={item.imagen} className='main__lastrecipes__recetas__receta__imagen' /></a>
                <a href={`/recipe?id=${item.id}`}><span className='main__lastrecipes__recetas__receta__titulo'>{item.nombre}</span></a>

                <div className='main__lastrecipes__recetas__receta__nombreLikes'>
                  <span>{item.nombreUsuario}</span>

                  <div className='main__lastrecipes__recetas__receta__nombreLikes__contenedor'>
                    <span>{item.likes}</span>
                    <FontAwesomeIcon icon='fa-solid fa-heart' size='sm' className='main__lastrecipes__recetas__receta__nombreLikes__contenedor__icono' />

                  </div>

                </div>

              </div>
            ))
          }
        </section>
        <a href='/recipes' className='main__lastrecipes__viewMore--movil movil' id='oculto'>View more...</a>

      </section>


      <section className='main__randomrecipe'>

        <div className='main__randomrecipe__contenedorImagen'>
          <img src="recetaAleatoria.jpg" alt="recetaAleatoria" />
        </div>

        <div className='main__randomrecipe__texto'>

          <span>What cook next</span>
          <a href="" id='botonRecetaAleatoria'>Continue</a>

        </div>

      </section>


      <footer className='main__footer'>

        <section className='main__footer__contenedor1'>
          <a href='/'>Cookpedia</a>
          <div className='main__footer_contenedor1__rrss'>

            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg></a>

          </div>
        </section>


        <section className='main__footer_contenedor2 desktop'>

          <a href=""><span>Legal disclaimer</span></a>
          <a href=""><span>Cookies</span></a>
          <a href=""><span>Privacy</span></a>
          <a href=""><span>Terms and conditions</span></a>

        </section>

      </footer>
    </main>
  )
}
