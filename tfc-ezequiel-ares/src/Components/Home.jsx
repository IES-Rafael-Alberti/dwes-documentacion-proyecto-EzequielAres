import React, { useEffect } from 'react';
import { IntroVideo } from "./HomeComponents/IntroVideo";
import { Buscador } from './HomeComponents/Buscador';
import { LastRecipes } from './HomeComponents/LastRecipes';
import { RandomRecipe } from './HomeComponents/RandomRecipe';
import { Footer } from './HomeComponents/Footer';

export const Home = () => {

  // Función para comprobar el estilo que vamos a aplicar a la página
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

  // Función para cambiar el vídeo del título cuando la página llegue a un cierto ancho
  function comprobarAncho() {
    let width = window.matchMedia("(max-width: 476px)");
    let video = document.getElementById("videoTitulo");

    // Comprobamos que la pantalla tiene el ancho especificado, si el video ya está cambiado lo dejamos, si no cambiamos el src
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

      // Si el ancho es mayor que el descrito ponemos el video para desktop, si el video ya está cambiado lo dejamos, si no cambiamos el src
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

  // Establecemos un intervalo para ir comprobancho el ancho de la página
  function establecerIntervalo() {
    let intervaloAncho = window.setInterval(comprobarAncho, 100);
  }

  window.addEventListener('load', establecerIntervalo, 1);


  return (
    <main className='main'>
      <IntroVideo />
      <Buscador />
      <LastRecipes />
      <RandomRecipe />
      <Footer />
    </main>
  )
}
