import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";

export const Buscador = () => {

    library.add(faSearch);

    const [busqueda, setBusqueda] = React.useState([]);
    const navigate = useNavigate();

    // Función para redirigirnos a la página de recetas con la búsqueda del usuario
    const buscar = e => {
        e.preventDefault();

        navigate(`recipes/?name=${busqueda}&order=date`);
    }

    return (
        <section className='main__buscador'>

            <span className='main__buscador__texto'>Search</span>

            <form>
                <div className='main__buscador__contenedor'>
                    <input onSubmit={buscar} type="text" className="main__buscador__contenedor__input" onChange={e => setBusqueda(e.target.value)} />
                    <button onClick={buscar} className='main__buscador__contenedor__icono'><FontAwesomeIcon icon='fa fa-search' size='xl' /></button>
                </div>
            </form>

        </section>
    )
}
