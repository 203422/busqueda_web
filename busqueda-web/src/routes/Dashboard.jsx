import '../assets/styles/dashboard.css'
import { API_URL } from '../auth/url';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import toast, { Toaster } from 'react-hot-toast';

Modal.setAppElement('#root');

const Dashboard = () => {

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalNew, setShowModalNew] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);

    const [codeEdit, setCodeEdit] = useState("");
    const [nameEdit, setNameEdit] = useState("");
    const [emailEdit, setEmailEdit] = useState("");
    const [phoneEdit, setPhoneEdit] = useState("");

    const [newCode, setNewCode] = useState("");
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");



    function resetValues(e) {
        e.preventDefault();
        setCode("");
        setName("");
        setEmail("");
        setPhone("");
    }

    function onCodeChanged(e) {
        setCode(e.target.value)
        setName("")
        setEmail("")
        setPhone("")
    }

    function onNameChanged(e) {
        setName(e.target.value)
        setCode("")
        setEmail("")
        setPhone("")
    }

    function onEmailChanged(e) {
        setEmail(e.target.value)
        setCode("")
        setName("")
        setPhone("")
    }

    function onPhoneChanged(e) {
        setPhone(e.target.value)
        setCode("")
        setName("")
        setEmail("")
    }

    async function handleNewCustomer() {
        if (!newCode || !newName || !newEmail || !newPhone) {
            toast.error('Completa todos los campos')
            return;
        }
        const codeRegex = /^\d+$/;
        if (!codeRegex.test(newCode)) {
            toast.error('La clave solo se acepta números digitos')
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            toast.error('No tiene formato de correo electrónico')
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(newPhone)) {
            toast.error('El número de teléfono son de 10 digítos')
            return;
        }

        try {
            const response = await fetch(`${API_URL}/customer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "clave": newCode,
                    "nombre": newName,
                    "correo": newEmail,
                    "telefono": newPhone,
                })
            });

            if (response.ok) {
                const json = await response.json();
                setCustomers(json.cliente)
                toast.success('Cliente creado')
            } else {

            }

        } catch (error) {
            console.log('Error: ', error);
            setCustomers([])
        }

        setNewCode("")
        setNewName("")
        setNewEmail("")
        setNewPhone("")
        setShowModalNew(false)
    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!code && !name && !email && !phone) return;

        let url_search = "";

        if (code) url_search = `code/${code}`;
        if (name) url_search = `name/${name}`;
        if (email) url_search = `email/${email}`;
        if (phone) url_search = `phone/${phone}`;

        try {
            const response = await fetch(`${API_URL}/customer/${url_search}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const json = await response.json();
                setCustomers(json.clientes)
                if (json.clientes.length <= 0) {
                    toast('Cliente no encontrado')
                }
            } else {
                setCustomers([])
            }

        } catch (error) {
            console.log('Error: ', error);
            setCustomers([])
        }

    }

    async function handleDelete() {
        try {
            const response = await fetch(`${API_URL}/customer/${identifier}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const json = await response.json();
                setCustomers(customers.filter(c => c.clave !== identifier));
                toast.success('Cliente eliminado')

            } else {
                console.log('Error al eliminar el cliente');
            }

        } catch (error) {
            console.log('Error: ', error);
        }
        setIdentifier("")
        setShowModalDelete(false)
    }

    async function updateData() {

        let url_search = "";

        if (code) url_search = `code/${code}`;
        if (name) url_search = `name/${name}`;
        if (email) url_search = `email/${email}`;
        if (phone) url_search = `phone/${phone}`;

        try {
            const response = await fetch(`${API_URL}/customer/${url_search}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const json = await response.json();
                setCustomers(json.clientes)
            } else {
                setCustomers([])
            }

        } catch (error) {
            console.log('Error: ', error);
            setCustomers([])
        }

    }

    async function handleEdit() {

        if (!codeEdit && !nameEdit && !emailEdit && !phoneEdit) {
            toast.error('Completa todos los campos')
            return;
        };

        const codeRegex = /^\d+$/;
        if (!codeRegex.test(codeEdit)) {
            toast.error('La clave solo se acepta números digitos')
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailEdit)) {
            toast.error('No tiene formato de correo electrónico')
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneEdit)) {
            toast.error('El número de teléfono son de 10 digítos')
            return;
        }

        const updatedCustomer = {
            clave: codeEdit,
            nombre: nameEdit,
            correo: emailEdit,
            telefono: phoneEdit,
        };

        try {
            const response = await fetch(`${API_URL}/customer/${identifier}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedCustomer)
            });

            if (response.ok) {
                const json = await response.json();
                await updateData()
                toast.success("Cliente actualizado")
                setShowModal(false);
            } else {
                console.log('Error al actualizar el cliente');
            }
        } catch (error) {
            console.log('Error: ', error);
        }
        setIdentifier("");

    }



    const handleEditModal = (customer) => {
        setIdentifier(customer.clave);
        setCodeEdit(customer.clave);
        setNameEdit(customer.nombre);
        setEmailEdit(customer.correo);
        setPhoneEdit(customer.telefono);
        setShowModal(true);
    };

    const handleDeleteModal = (customer) => {
        setIdentifier(customer.clave)
        setShowModalDelete(true)
    }


    const closeModal = () => {
        setIdentifier("");
        setCodeEdit("");
        setNameEdit("");
        setEmailEdit("");
        setPhoneEdit("");
        setShowModal(false);
    };

    const closeNewModal = () => {
        setNewCode("");
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setShowModalNew(false)
    }

    const createNewCustomerModal = () => {
        setShowModalNew(true)
    }

    const closeModalDelete = () => {
        setIdentifier("")
        setShowModalDelete(false);
    }


    return (
        <div className='container'>
            <div className='container_search'>

                <form className="form_search">
                    <h2 className='title_search'>Buscar registros</h2>
                    <p>Ingresa el dato que deseas filtrar</p>
                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Clave'
                            value={code}
                            onChange={onCodeChanged}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Nombre'
                            value={name}
                            onChange={onNameChanged}
                        />
                    </div>

                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Correo'
                            value={email}
                            onChange={onEmailChanged}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Teléfono'
                            value={phone}
                            onChange={onPhoneChanged}
                        />
                    </div>

                    <div className='buttons'>
                        <button className='button_search' onClick={handleSubmit}>
                            Buscar
                        </button>
                        <button type='button' className='button_new' onClick={createNewCustomerModal}>
                            Crear nuevo cliente
                        </button>

                    </div>
                </form>


                {
                    customers.length <= 0 ? <></> :
                        <div className='container_results_primary'>
                            <div className='header_results_container'>

                                <div className='header_elements'>
                                    <div className='header_code'>
                                        <p>Clave</p>
                                    </div>
                                    <div className='header_name'>
                                        <p>Nombre</p>

                                    </div>
                                    <div className='header_email'>
                                        <p>correo</p>

                                    </div>
                                    <div className='header_phone'>
                                        <p>teléfono</p>

                                    </div>
                                </div>
                            </div>

                            <div className='container_results'>


                                {customers.map(customer => (
                                    <div key={customer.clave} className='customer_item'>
                                        <div className='result_customer'>
                                            <div className='customer_div customer_code'><p>{customer.clave}</p></div>
                                            <div className='customer_div customer_name'><p>{customer.nombre}</p></div>
                                            <div className='customer_div customer_email'><p>{customer.correo}</p></div>
                                            <div className='customer_div customer_phone'><p>{customer.telefono}</p></div>


                                        </div>

                                        <div className='buttons_customers'>
                                            <button onClick={() => handleEditModal(customer)}>Editar</button>
                                            <button className='delete' onClick={() => handleDeleteModal(customer)}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                }

            </div>


            <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Cambia el color y la opacidad del fondo de desenfoque
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        outline: 'none',
                        padding: '20px',
                        width: 'max-content',
                        height: 'max-content',
                    }
                }}
            >
                <form className="form_edit">
                    <h2 className='title_search'>Editar cliente</h2>
                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Clave cliente'
                            value={codeEdit}
                            onChange={(e) => setCodeEdit(e.target.value)}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Nombre contacto'
                            value={nameEdit}
                            onChange={(e) => setNameEdit(e.target.value)}
                        />
                    </div>

                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Correo'
                            value={emailEdit}
                            onChange={(e) => setEmailEdit(e.target.value)}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Teléfono contacto'
                            value={phoneEdit}
                            onChange={(e) => {
                                const inputPhone = e.target.value.replace(/\D/g, '');
                                setPhoneEdit(inputPhone.slice(0, 10));
                            }}
                            maxLength={10}
                        />

                    </div>

                </form>
                <div className='buttons_container_edit'>

                    <button onClick={handleEdit}>Aceptar</button>
                    <button onClick={closeModal} className='cancel'>Cancelar</button>
                </div>

            </Modal>

            <Modal
                isOpen={showModalNew}
                onRequestClose={closeNewModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Cambia el color y la opacidad del fondo de desenfoque
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        outline: 'none',
                        padding: '20px',
                        width: 'max-content',
                        height: 'max-content',
                    }
                }}
            >
                <form className="form_edit">
                    <h2 className='title_search'>Nuevo cliente</h2>
                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Clave cliente'
                            value={newCode}
                            onChange={(e) => setNewCode(e.target.value)}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Nombre contacto'
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>

                    <div className='div_input'>
                        <input
                            className="input"
                            type="text"
                            placeholder='Correo'
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <input
                            className="input"
                            type="text"
                            placeholder='Teléfono contacto'
                            value={newPhone}
                            onChange={(e) => {
                                const inputPhone = e.target.value.replace(/\D/g, '');
                                setNewPhone(inputPhone.slice(0, 10));
                            }}
                            maxLength={10}
                        />

                    </div>

                </form>
                <div className='buttons_container_edit'>

                    <button onClick={handleNewCustomer}>Aceptar</button>
                    <button onClick={closeNewModal} className='cancel'>Cancelar</button>
                </div>

            </Modal>

            <Modal
                isOpen={showModalDelete}
                onRequestClose={closeModalDelete}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        outline: 'none',
                        padding: '20px',
                        width: 'max-content',
                        height: 'max-content',
                    }
                }}>


                <div>
                    <h2 className='title_search title_delete'>
                        ¿Eliminar cliente?
                    </h2>
                    <div className='buttons_container_delete'>

                        <button onClick={handleDelete}>Aceptar</button>
                        <button onClick={closeModalDelete} className='cancel'>Cancelar</button>
                    </div>
                </div>

            </Modal>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />


        </div>
    );
}

export default Dashboard