import React from 'react';
import { useNavigate } from 'react-router-dom';


export const BotonLogout = () => {
    const navigate = useNavigate();

    // Eliminamos el jwt y el id para cerrar sesion y redirigimos al home
    function cerrarSesion() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("id");
        navigate("/");
    }

    return (
        <button onClick={cerrarSesion} className='Configure__main__contenedor__cerrarSesion'>Logout</button>
    )
}
