import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { useSearchParams } from 'react-router-dom';

export const ListRecipes = () => {

    library.add(faSearch, faClock, faHeart);
    const [searchParams] = useSearchParams();
    const [recetas, setRecetas] = React.useState([]);

    const [busqueda, setBusqueda] = React.useState(searchParams.get("name"));
    const [tipoBusqueda, setTipoBusqueda] = React.useState("date");

    // Función para obtener el listado de recetas según el orden indicado
    async function obtenerRecetas() {

        // Si no hemos indicado un filtro por nombre
        if (busqueda == null || busqueda == "") {
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/receta/list?order=${tipoBusqueda}`);
                const resJson = await res.json();
                const resultado = [];

                // Según el orden iremos añadiendo las recetas al principio o final de la lista
                if (tipoBusqueda == "date") {
                    for (const receta in resJson) {
                        resultado.unshift(resJson[receta][0]);
                    }
                } else {
                    for (const receta in resJson) {
                        resultado.push(resJson[receta][0]);
                    }
                }

                setRecetas(resultado);
            } catch (error) {
                console.log("errorObtenerRecetasRecipes");
            }
        } else {
            // Si hemos introducido un texto en el buscador cambiamos la llamada para filtrar también por este 
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/receta/search/${busqueda}?order=${tipoBusqueda}`);
                const resJson = await res.json();
                const resultado = [];

                if (tipoBusqueda == "date") {
                    for (const receta in resJson) {
                        resultado.unshift(resJson[receta][0]);
                    }
                } else {
                    for (const receta in resJson) {
                        resultado.push(resJson[receta][0]);
                    }
                }

                setRecetas(resultado);
            } catch (error) {
                console.log("errorObtenerRecetasRecipes");
            }
        }
    };

    useEffect(() => {
        obtenerRecetas();
    }, [busqueda, tipoBusqueda])

    const buscar = e => {
        e.preventDefault();

        obtenerRecetas();
    }

    return (
        <section>
            <section className='Recipes__main__buscador'>

                <span className='Recipes__main__buscador__texto desktop'>Search</span>

                <form>

                    <div className='Recipes__main__buscador__contenedor'>
                        <input onSubmit={buscar} onChange={e => setBusqueda(e.target.value)} value={busqueda} type="text" className="Recipes__main__buscador__contenedor__input" />
                        <button onClick={buscar} className='Recipes__main__buscador__contenedor__icono'><FontAwesomeIcon icon='fa fa-search' size='xl' /></button>
                    </div>

                </form>

                <button id="date" onClick={() => { setTipoBusqueda("date") }} className='Recipes__main__buscador__icono'><FontAwesomeIcon icon='fa-solid fa-clock' size='xl' className='Recipes__main__buscador__icono' /></button>
                <button id="likes" onClick={() => { setTipoBusqueda("likes") }} className='Recipes__main__buscador__icono'><FontAwesomeIcon icon='fa-solid fa-heart' size='xl' className='Recipes__main__buscador__icono' /></button>
            </section>


            <section className='Recipes__main__recetas'>

                {
                    recetas.map(item => (
                        <div className='Recipes__main__recetas__receta' key={item.id}>
                            <a href={`/recipe?id=${item.id}`}><img src={item.imagen} className='Recipes__main__recetas__receta__imagen' /></a>
                            <a href={`/recipe?id=${item.id}`}><span className='Recipes__main__recetas__receta__titulo'>{item.nombre}</span></a>
                            <div className='Recipes__main__recetas__receta__nombreLikes'>
                                <span>{item.nombreUsuario}</span>
                                <div className='Recipes__main__recetas__receta__nombreLikes__contenedor'>
                                    <span>{item.likes}</span>
                                    <FontAwesomeIcon icon='fa-solid fa-heart' size='sm' className='Recipes__main__recetas__receta__nombreLikes__contenedor__icono' />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </section>
        </section>
    )
}
