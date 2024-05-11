import {
    getNotePad,
} from './indexedDb.js';


//  Este evento se ejecuta cuando la pagina se carga
window.addEventListener('load', () => {
    registerSW();
    loadComponents();
})


// Funcion para registrar el service worker
const registerSW = async () => {
    if ('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('./sw.js');
            // Registro del servicio worker
            const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js', {
                updateViaCache: 'none'
            });
            // Obtención del token de registro para recibir notificaciones push
            const token = await messaging.getToken({
                serviceWorkerRegistration: registration
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