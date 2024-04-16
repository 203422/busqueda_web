import '../assets/styles/form.css'
import { useState } from 'react';
import { API_URL } from '../auth/url';
import { Navigate, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../auth/AuthProvider';


const Form = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Asegúrate de incluir este encabezado
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.ok) {
                const json = await response.json();
                console.log(json);
                auth.setUser();
                goTo("/busqueda");

            } else {
                const json = await response.json();
                toast.error(json.message);

            }

        } catch (error) {
            console.log('Error: ', error);
        }

    }


    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h1 className="title_form">Bienvenido</h1>
                <p>Por favor ingresa tus datos</p>
                <input
                    className="input"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>
                    Entrar
                </button>
            </form>

            <Toaster />
        </>
    );
}

export default Form;