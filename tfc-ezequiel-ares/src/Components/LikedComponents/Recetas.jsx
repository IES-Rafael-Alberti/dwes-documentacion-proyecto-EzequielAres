import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

export const Recetas = () => {

    library.add(faHeart);

    const [recetas, setRecetas] = React.useState([]);

    // Obtenemos las recetas indicando nuestro Id de usuario
    async function obtenerRecetas() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/like/recetas/${localStorage.getItem("id")}`);
            const resJson = await res.json();
            const resultado = [];

            // Recorremos el json de respuesta para añadir las recetas a la lista
            for (const receta in resJson) {
                resultado.unshift(resJson[receta][0]);
            }

            setRecetas(resultado);
        } catch (error) {
            console.log("error");
        }
    }

    window.addEventListener('load', obtenerRecetas, 1);

    return (
        <section className='Liked__main__recetas'>
            {
                recetas.map(item => (
                    <div className='Liked__main__recetas__receta' key={item.id}>
                        <a href={`/recipe?id=${item.id}`}><img src={item.imagen} className='Liked__main__recetas__receta__imagen' /></a>
                        <a href={`/recipe?id=${item.id}`}><span className='Liked__main__recetas__receta__titulo'>{item.nombre}</span></a>
                        <div className='Liked__main__recetas__receta__nombreLikes'>
                            <span>{item.nombreUsuario}</span>
                            <div className='Liked__main__recetas__receta__nombreLikes__contenedor'>
                                <span>{item.likes}</span>
                                <FontAwesomeIcon icon='fa-solid fa-heart' size='sm' className='Liked__main__recetas__receta__nombreLikes__contenedor__icono' />
                            </div>
                        </div>
                    </div>
                ))
            }
        </section>
    )
}
