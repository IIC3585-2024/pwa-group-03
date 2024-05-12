// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, remove, push, get, update, onValue} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUFuPDa05k-EdFyDs0HycXB7HjCMB4EDE",
  authDomain: "pwa-e3.firebaseapp.com",
  databaseURL: "https://pwa-e3-default-rtdb.firebaseio.com",
  projectId: "pwa-e3",
  storageBucket: "pwa-e3.appspot.com",
  messagingSenderId: "95901127219",
  appId: "1:95901127219:web:5e7fe6fc37c09f0af58946",
  measurementId: "G-76C5JG13G2"
};

const app = initializeApp(firebaseConfig);

const loadFirebase = async () => {
    initializeApp(firebaseConfig);
}
const database = getDatabase(app);  // Obtener la instancia de la base de datos al momento de la inicialización

// A continuacion se definen las funciones para un CRUD basico.
// Estructura de URL para un notepad: /notepads/{notepadId}
// Estructura de URL para una nota: /notepads/{notepadId}/notes/{noteId}

//            NOTEPADS
// Funcion para obtener un notepad en especifico
async function getNotepad(id) {
    const notepad = await ref(database, `notepads/${id}`);
    return notepad;
}

// Funcion para agregar un notepad
async function addNotepad(data) {
    await set(ref(database, 'notepads/' + data),{
        content: data
    })

    window.location.href = '/notePads.html?name=' + data;
    console.log('Notepad added');
}

//          NOTES
// Funcion para obtener todas las notas de un notepad
async function getNotes(notepadId) {
    return new Promise((resolve, reject) => {
        const notesRef = ref(database, 'notepads/' + notepadId);
        onValue(notesRef, async (snapshot) => {
            const data = await snapshot.val();
            if (!data){
                resolve([]);
                return;
            }
            const filteredData = Object.values(data).filter(item => item.hasOwnProperty('content'));
            resolve(filteredData);
        });
    });
}


// Funcion para obtener una nota en especifico  
async function getNote(notepadId, noteId) {
    return new Promise((resolve, reject) => {
        const notesRef = ref(database, 'notepads/' + notepadId + '/' + noteId);
        onValue(notesRef, async (snapshot) => {
            const data = await snapshot.val();
            if (!data){
                resolve([]);
                return;
            }
            resolve(data.content)
        });
    });
}

// Funcion para agregar una nota
async function addNote(notepadId, data) {
    await set(ref(database, `notepads/${data}/${notepadId.content}`),{
        content: notepadId.content
    })
}

// funcion para eliminar una nota
async function deleteNote(noteId, notepadName) {
    const noteRef = ref(database, `notepads/${notepadName}/${noteId}`);
    return remove(noteRef);  
}

// funcion para eliminar todas las notas de un notepad
async function deleteNotes(notepadName) {
    const notes = await getNotes(notepadName);
    notes.forEach(async (note) => {
        await deleteNote(note.content, notepadName);
    });
}

// funcion para editar una nota
async function editNote(notepadId, noteId, notepadName) {
    const updates = {};
    updates['/notepads/' + notepadName  + '/' + notepadId ] = {content: noteId.content}

    return update(ref(database), updates);
}

export { getNotepad, addNotepad, getNotes, getNote, addNote, deleteNote, deleteNotes, editNote, loadFirebase};
