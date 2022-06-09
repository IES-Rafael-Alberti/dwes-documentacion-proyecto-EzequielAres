import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BotonDeleteUser = () => {
    const navigate = useNavigate();

    // Función para eliminar el usuario con el que hemos iniciado sesión
    async function deleteUser() {
        try {

            let settings = {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch(`http://127.0.0.1:5000/api/usuario/${localStorage.getItem("id")}`, settings);

            localStorage.removeItem("jwt");
            localStorage.removeItem("id");
            navigate("/");

        } catch (error) {
            console.log("errorEliminarUser")
        }
    }

    return (
        <button onClick={deleteUser} className='Configure__main__contenedor__deleteUser'>Delete User</button>
    )
}
