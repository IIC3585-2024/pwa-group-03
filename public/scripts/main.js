import { getNotePad } from './indexedDb.js';
import { loadFirebase } from './loadFirebase.js';


//  Este evento se ejecuta cuando la pagina se carga
window.addEventListener('load', () => {
    registerSW();
    loadComponents();
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

// Funcion para actualizar el estado de la conexion (por ahora solo a nivel de texto)
function toggleOnlineOffline() {
    const checkbox = document.getElementById('status-checkbox');  
    const statusText = document.getElementById('status-text');  
    function updateStatus() {
        statusText.textContent = checkbox.checked ? 'online' : 'offline';
    }
    checkbox.addEventListener('change', updateStatus);
    updateStatus();
}

// Funcion para mostrar notificaciones
function notificationButton() {
    const notificationButton = document.getElementById('notificationButton');
    notificationButton.addEventListener('click', () => {
        Notification.requestPermission().then((result) => {
            if (result === 'granted') {
                new Notification('Se han activado las notificaciones');
                notificationButton.classList.remove('btn-ghost');
            }
        });
    });
}

// Funcion para renderizar componentes que se repiten en diferntes vistas (navbar y footer)
const components = ['navbar', 'footer'];
async function loadComponent(component, id) {
    const element = document.getElementById(id);
    await fetch(`./components/${component}.html`)
    .then(response => response.text())
    .then(html => {
        element.innerHTML = html;
        // me dejo de funcionar el toggle y esto lo soluciono jeje.
        if (component === 'navbar') {
            toggleOnlineOffline();
            notificationButton();
        }
    });
}
const loadComponents = async () => {
    components.forEach(component => {
        loadComponent(component, component);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const notePadName = document.getElementById('notePadName');
    const createNotePadButton = document.getElementById('createNotePadButton');

    notePadName.addEventListener('input', (event) => {
        createNotePadButton.disabled = !event.target.value;
    });

    createNotePadButton.addEventListener('click', () => {
        getNotePad(notePadName.value.trim());
        notePadName.value = '';
    });
})