
const API_BASE_URL = 'https://crudrommeldotnet.onrender.com/api'; 


let clientes = [];
let servicios = [];
let editandoCliente = false;
let editandoServicio = false;


document.addEventListener('DOMContentLoaded', function() {
    cargarClientes();
    cargarServicios();
    inicializarEventListeners();
});


function inicializarEventListeners() {
    
    document.getElementById('clienteForm').addEventListener('submit', manejarSubmitCliente);
    document.getElementById('btnCancelarCliente').addEventListener('click', cancelarEdicionCliente);
    
    
    document.getElementById('servicioForm').addEventListener('submit', manejarSubmitServicio);
    document.getElementById('btnCancelarServicio').addEventListener('click', cancelarEdicionServicio);
    
    
    document.getElementById('filtroCliente').addEventListener('change', filtrarServicios);
}

// === FUNCIONES DE CLIENTES ===

async function cargarClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/Cliente`);
        if (response.ok) {
            clientes = await response.json();
            mostrarClientes();
            cargarClientesEnSelect();
        } else {
            mostrarError('Error al cargar clientes');
        }
    } catch (error) {
        mostrarError('Error de conexión al cargar clientes');
        console.error('Error:', error);
    }
}

function mostrarClientes() {
    const tbody = document.querySelector('#clientesTable tbody');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${cliente.clienteId}</td>
            <td>${cliente.nombreCliente}</td>
            <td>${cliente.correo}</td>
            <td>
                <button class="btn-edit" onclick="editarCliente(${cliente.clienteId})">Editar</button>
                <button class="btn-delete" onclick="eliminarCliente(${cliente.clienteId})">Eliminar</button>
            </td>
        `;
    });
}

function cargarClientesEnSelect() {
    const selectServicio = document.getElementById('clienteIdSelect');
    const selectFiltro = document.getElementById('filtroCliente');
    
    
    selectServicio.innerHTML = '<option value="">Seleccione un cliente</option>';
    selectFiltro.innerHTML = '<option value="">Todos los clientes</option>';
    
    clientes.forEach(cliente => {
        const option1 = new Option(cliente.nombreCliente, cliente.clienteId);
        const option2 = new Option(cliente.nombreCliente, cliente.clienteId);
        selectServicio.appendChild(option1);
        selectFiltro.appendChild(option2);
    });
}

async function manejarSubmitCliente(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const cliente = {
        clienteId: parseInt(formData.get('clienteId')) || 0,
        nombreCliente: formData.get('nombreCliente'),
        correo: formData.get('correo')
    };
    
    try {
        let response;
        if (editandoCliente) {
            response = await fetch(`${API_BASE_URL}/Cliente/${cliente.clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/Cliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente)
            });
        }
        
        if (response.ok) {
            mostrarExito(editandoCliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
            cancelarEdicionCliente();
            cargarClientes();
        } else {
            mostrarError('Error al guardar cliente');
        }
    } catch (error) {
        mostrarError('Error de conexión al guardar cliente');
        console.error('Error:', error);
    }
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.clienteId === id);
    if (cliente) {
        document.getElementById('clienteId').value = cliente.clienteId;
        document.getElementById('nombreCliente').value = cliente.nombreCliente;
        document.getElementById('correo').value = cliente.correo;
        document.getElementById('btnSubmitCliente').textContent = 'Actualizar Cliente';
        editandoCliente = true;
    }
}

function cancelarEdicionCliente() {
    document.getElementById('clienteForm').reset();
    document.getElementById('btnSubmitCliente').textContent = 'Guardar Cliente';
    editandoCliente = false;
}

async function eliminarCliente(id) {
    if (confirm('¿Está seguro de que desea eliminar este cliente? Esto también eliminará todos sus servicios.')) {
        try {
            const response = await fetch(`${API_BASE_URL}/Cliente/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                mostrarExito('Cliente eliminado correctamente');
                cargarClientes();
                cargarServicios();
            } else {
                mostrarError('Error al eliminar cliente');
            }
        } catch (error) {
            mostrarError('Error de conexión al eliminar cliente');
            console.error('Error:', error);
        }
    }
}

// === FUNCIONES DE SERVICIOS ===

async function cargarServicios() {
    try {
        const response = await fetch(`${API_BASE_URL}/Servicio`);
        if (response.ok) {
            servicios = await response.json();
            mostrarServicios();
        } else {
            mostrarError('Error al cargar servicios');
        }
    } catch (error) {
        mostrarError('Error de conexión al cargar servicios');
        console.error('Error:', error);
    }
}

function mostrarServicios(serviciosFiltrados = null) {
    const tbody = document.querySelector('#serviciosTable tbody');
    tbody.innerHTML = '';
    
    const serviciosAMostrar = serviciosFiltrados || servicios;
    
    serviciosAMostrar.forEach(servicio => {
        const cliente = clientes.find(c => c.clienteId === servicio.clienteId);
        const nombreCliente = cliente ? cliente.nombreCliente : 'Cliente no encontrado';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${servicio.servicioId}</td>
            <td>${servicio.nombreServicio}</td>
            <td>${servicio.descripcion || 'Sin descripción'}</td>
            <td>${nombreCliente}</td>
            <td>
                <button class="btn-edit" onclick="editarServicio(${servicio.servicioId})">Editar</button>
                <button class="btn-delete" onclick="eliminarServicio(${servicio.servicioId})">Eliminar</button>
            </td>
        `;
    });
}

async function manejarSubmitServicio(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const servicio = {
        servicioId: parseInt(formData.get('servicioId')) || 0,
        nombreServicio: formData.get('nombreServicio'),
        descripcion: formData.get('descripcion') || null,
        clienteId: parseInt(formData.get('clienteId'))
    };
    
    try {
        let response;
        if (editandoServicio) {
            response = await fetch(`${API_BASE_URL}/Servicio/${servicio.servicioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicio)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/Servicio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(servicio)
            });
        }
        
        if (response.ok) {
            mostrarExito(editandoServicio ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
            cancelarEdicionServicio();
            cargarServicios();
        } else {
            const errorText = await response.text();
            mostrarError('Error al guardar servicio: ' + errorText);
        }
    } catch (error) {
        mostrarError('Error de conexión al guardar servicio');
        console.error('Error:', error);
    }
}

function editarServicio(id) {
    const servicio = servicios.find(s => s.servicioId === id);
    if (servicio) {
        document.getElementById('servicioId').value = servicio.servicioId;
        document.getElementById('nombreServicio').value = servicio.nombreServicio;
        document.getElementById('descripcion').value = servicio.descripcion || '';
        document.getElementById('clienteIdSelect').value = servicio.clienteId;
        document.getElementById('btnSubmitServicio').textContent = 'Actualizar Servicio';
        editandoServicio = true;
    }
}

function cancelarEdicionServicio() {
    document.getElementById('servicioForm').reset();
    document.getElementById('btnSubmitServicio').textContent = 'Guardar Servicio';
    editandoServicio = false;
}

async function eliminarServicio(id) {
    if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/Servicio/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                mostrarExito('Servicio eliminado correctamente');
                cargarServicios();
            } else {
                mostrarError('Error al eliminar servicio');
            }
        } catch (error) {
            mostrarError('Error de conexión al eliminar servicio');
            console.error('Error:', error);
        }
    }
}

function filtrarServicios() {
    const clienteId = document.getElementById('filtroCliente').value;
    
    if (clienteId === '') {
        mostrarServicios();
    } else {
        const serviciosFiltrados = servicios.filter(s => s.clienteId == clienteId);
        mostrarServicios(serviciosFiltrados);
    }
}

// === FUNCIONES DE UTILIDAD ===

function mostrarError(mensaje) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = mensaje;
    document.querySelector('.container').insertBefore(error, document.querySelector('.section'));
    
    setTimeout(() => {
        error.remove();
    }, 5000);
}

function mostrarExito(mensaje) {
    const exito = document.createElement('div');
    exito.className = 'success';
    exito.textContent = mensaje;
    document.querySelector('.container').insertBefore(exito, document.querySelector('.section'));
    
    setTimeout(() => {
        exito.remove();
    }, 3000);
}