import { getNotePad } from './indexedDb.js';
import { SimulatedConnection } from './connection.js';
import RepositoryFactory from '../repositories/RepositoryFactory.js';

//  Este evento se ejecuta cuando la pagina se carga
window.addEventListener('load', () => {
    loadComponents();
    toggleOnlineOffline();
    registerSW();
})


// Funcion para registrar el service worker
const registerSW = async () => {
    if ('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (error) {
            console.log('Failed to register service worker', error);
        }
    }
}

// Funcion para actualizar el estado de la conexion 
function toggleOnlineOffline() {
    const checkbox = document.getElementById('status-checkbox');
    const statusText = document.getElementById('status-text');

    if (!checkbox || !statusText) {
        console.warn('Elementos no disponibles, reintentando...');
        setTimeout(toggleOnlineOffline, 100);
        return;
    }

    function updateStatus() {
        const isConnected = SimulatedConnection.isConnected;
        statusText.textContent = isConnected ? 'online' : 'offline';
        checkbox.checked = isConnected;
    }

    checkbox.addEventListener('change', () => {
        SimulatedConnection.isConnected = checkbox.checked;
    });

    window.addEventListener('connectionChanged', updateStatus);

    updateStatus();
}


// Funcion para renderizar componentes que se repiten en diferntes vistas (navbar y footer)
const components = ['navbar', 'footer'];
async function loadComponent(component, id) {
    const element = document.getElementById(id);
    const response = await fetch(`./components/${component}.html`);
    const html = await response.text();
    element.innerHTML = html;
    if (component === 'navbar') {
        toggleOnlineOffline();  
    }
}

const loadComponents = async () => {
    for (const component of components) {
        await loadComponent(component, component);
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const notePadName = document.getElementById('notePadName');
    const createNotePadButton = document.getElementById('createNotePadButton');

    notePadName.addEventListener('input', (event) => {
        createNotePadButton.disabled = !event.target.value;
    });

    createNotePadButton.addEventListener('click', () => {
        // getNotePad(notePadName.value.trim());
        const repo = RepositoryFactory.getRepository(); //*
        repo.createNotepad(notePadName.value.trim()); //*
        notePadName.value = '';
    });
})