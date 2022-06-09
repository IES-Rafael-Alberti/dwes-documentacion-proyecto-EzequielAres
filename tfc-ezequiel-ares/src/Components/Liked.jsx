import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from './LikedComponents/Footer';
import { Recetas } from './LikedComponents/Recetas';


export const Liked = () => {
  const navigate = useNavigate();

  // Comprueba si hemos iniciado sesion, si no redirige a login
  function comprobarLogin() {
    if (localStorage.getItem("jwt") == undefined) {
      navigate("/login");
    }
  }

  window.addEventListener('load', comprobarLogin);

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/liked/likedNoche.scss');
      require('../css/liked/likedResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/liked/liked.scss');
      require('../css/liked/likedResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  return (
    <main className='Liked__main'>
      <Recetas />
      <Footer />
    </main>
  )
}
