import { getNotePad } from './indexedDb.js';

import { SimulatedConnection } from './connection.js';
import RepositoryFactory from '../repositories/RepositoryFactory.js';
// import { loadFirebase } from './loadFirebase.js';
import { loadFirebase } from './firebaseDb.js';


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
            await loadFirebase();
            await navigator.serviceWorker.register('./sw.js')
            .then(() => {
                console.log('Service worker registered');
            });
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


// Funcion para mostrar notificaciones
function notificationButton() {
    const notificationButton = document.getElementById('notificationButton');
    const notificationIcon = document.getElementById('notificationIcon');

    notificationButton.addEventListener('click', () => {
        if (Notification.permission === 'granted') {
            new Notification('Las notificaciones ya están activadas');
            notificationButton.classList.remove('btn-ghost');
            notificationIcon.classList.remove('invisible');
                setTimeout(() => {
                    notificationIcon.classList.add('invisible');
                }, 3000);
            return;
        }
        Notification.requestPermission().then((result) => {
            if (result === 'granted') {
                new Notification('Se han activado las notificaciones');
                notificationButton.classList.remove('btn-ghost');
                notificationIcon.classList.remove('invisible');
                setTimeout(() => {
                    notificationIcon.classList.add('invisible');
                }, 3000);
                }
        });
    });
}

function surpriseButton() {
    const surpriseButton = document.getElementById('surprise');
    surpriseButton.addEventListener('click', () => {
        if (Notification.permission != 'granted') {
            Notification.requestPermission().then((result) => {
                if (result != 'granted') {
                    return;
                }
            });
        }
        navigator.geolocation.getCurrentPosition(showPosition);
    });
}

function showPosition(position) {
    new Notification('Ubicación', { body: 'Te encontramos' });
    setTimeout(() => {
        let msg = "Latitude: " + position.coords.latitude;
        msg += "\nLongitude: " + position.coords.longitude;
        new Notification('Acabas de ser doxxeado', { body: msg });
    }, 10000);
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
        notificationButton();
        surpriseButton();
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

// Funcion para mostrar notificaciones
window.addEventListener('offline', () => {
    if (Notification.permission === 'granted') {
        new Notification('Se ha perdido la conexión a internet');
    }
});