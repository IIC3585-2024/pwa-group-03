function openDb() {
    const request = indexedDB.open('db', 1);

    request.onerror = (event) => {
        console.log('Error al abrir la base de datos', event.target.error);
    }

    request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('notePads')) {
            db.createObjectStore('notePads', { keyPath: 'name' });
        }

        if (!db.objectStoreNames.contains('notes')) {
            const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
            notesStore.createIndex('notePadName', 'notePadName');
        }
    }

    return request;
}


function getNotePad(name) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notePads', 'readonly');
        const store = transaction.objectStore('notePads');
        const getRequest = store.get(name);

        getRequest.onsuccess = (event) => {
            const notePad = event.target.result;
            if (notePad) {
                console.log('Block de notas obtenido de la base de datos', event.target.result);
                window.location.href = '/notePads.html?name=' + name;
            } else {
                createNotePad({ name });
            }
        }

        getRequest.onerror = (event) => {
            console.log('Error al obtener el block de notas de la base de datos', event.target.error);
        }
    }
}


function createNotePad(notePad) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notePads', 'readwrite');
        const store = transaction.objectStore('notePads');

        const addRequest = store.add(notePad);

        addRequest.onsuccess = () => {
            console.log('Block de notas agregado a la base de datos');
            window.location.href = '/notePads.html?name=' + notePad.name;
        }

        addRequest.onerror = (event) => {
            console.log('Error al agregar el block de notas a la base de datos', event.target.error);
        }
    }
}


function createNote(note, notePadName) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');

        const addRequest = store.add({ ...note, notePadName });

        addRequest.onsuccess = () => {
            console.log('Nota agregada a la base de datos');
        }

        addRequest.onerror = (event) => {
            console.log('Error al agregar la nota a la base de datos', event.target.error);
        }
    }
}


function getNotes(notePadName, showNotes) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('notePadName');
        const getRequest = index.getAll(notePadName);

        getRequest.onsuccess = (event) => {
            const notes = event.target.result;
            console.log('Notas obtenidas de la base de datos', notes);
            showNotes(notes);
        }

        getRequest.onerror = (event) => {
            console.log('Error al obtener las notas de la base de datos', event.target.error);
        }
    }
}

function getNote(notePadName, noteId, showNote) {
    getNotes(notePadName, (notes) => {
        const note = notes.find(note => note.id === noteId);
        showNote(note);
    });
}


function deleteNotes(notePadName) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const index = store.index('notePadName');
        const getRequest = index.getAllKeys(notePadName);

        getRequest.onsuccess = (event) => {
            const keys = event.target.result;

            keys.forEach(key => {
                store.delete(key);
            });

            console.log('Notas eliminadas de la base de datos');
        }

        getRequest.onerror = (event) => {
            console.log('Error al obtener las notas de la base de datos', event.target.error);
        }
    }
}


function deleteNote(noteId, next) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const deleteRequest = store.delete(noteId);

        deleteRequest.onsuccess = () => {
            console.log('Nota eliminada de la base de datos');
            if (next) {
                next();
            }
        }

        deleteRequest.onerror = (event) => {
            console.log('Error al eliminar la nota de la base de datos', event.target.error);
        }
    }
}


function editNote(noteId, newNote) {
    const request = openDb();

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const getRequest = store.get(noteId);

        getRequest.onsuccess = (event) => {
            const note = event.target.result;

            store.put({ ...note, ...newNote });

            console.log('Nota editada en la base de datos');
        }

        getRequest.onerror = (event) => {
            console.log('Error al obtener la nota de la base de datos', event.target.error);
        }
    }
}


export {
    getNotePad,
    createNote,
    getNotes,
    deleteNotes,
    deleteNote,
    editNote,
    getNote
}
