import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

export const LastRecipes = () => {

    library.add(faHeart);

    const [recetas, setRecetas] = React.useState([]);

    // Función para obtener las últimas 6 recetas creadas
    async function obtenerRecetasHome() {
        try {
            const res = await fetch("http://127.0.0.1:5000/api/receta/home");
            const resJson = await res.json();
            const resultado = [];

            // Vamos recorriendo el Json de respuesta para obtener los valores de las recetas
            for (const receta in resJson) {
                resultado.unshift(resJson[receta][0]);
            }

            setRecetas(resultado);
        } catch (error) {
            console.log("error")
        }
    };

    window.addEventListener('load', obtenerRecetasHome, 1);


    return (
        <section className='main__lastrecipes'>

            <div className='main__lastrecipes__titulo'>
                <span>Last recipes</span>
                <a href='/recipes' className='desktop'>View more...</a>
            </div>


            <section className='main__lastrecipes__recetas'>
                {/* Recorremos las recetas que hemos obtenido en la función */}
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
    )
}
