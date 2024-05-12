function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('db', 1);

        request.onerror = (event) => {
            console.log('Error al abrir la base de datos', event.target.error);
            reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('notePads')) {
                db.createObjectStore('notePads', { keyPath: 'name' });
            }
            if (!db.objectStoreNames.contains('notes')) {
                const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                notesStore.createIndex('notePadName', 'notePadName');
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}


//                 GETS A NOTEPAD BY ITS NAME
async function getNotePad(name) {
    try {
        const db = await openDb();
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
        };

        getRequest.onerror = (event) => {
            console.log('Error al obtener el block de notas de la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}


//          CREATES A NOTEPAD THROUGH AN OBJECT
async function createNotePad(notePad) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notePads', 'readwrite');
        const store = transaction.objectStore('notePads');
        const addRequest = store.add(notePad);

        addRequest.onsuccess = () => {
            console.log('Block de notas agregado a la base de datos');
            window.location.href = '/notePads.html?name=' + notePad.name;
        };

        addRequest.onerror = (event) => {
            console.log('Error al agregar el block de notas a la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}


async function getNotePadObject(name) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notePads', 'readonly');
        const store = transaction.objectStore('notePads');
        const getRequest = store.get(name);

        return new Promise((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const notePad = event.target.result;
                console.log('Block de notas obtenido de la base de datos', notePad);
                resolve(notePad);
            };

            getRequest.onerror = (event) => {
                console.log('Error al obtener el block de notas de la base de datos', event.target.error);
                reject(null);
            };
        });
    } catch (error) {
        console.error('Error opening DB:', error);
        return null;
    }
}


async function editNotePad(name, newNotePad) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notePads', 'readwrite');
        const store = transaction.objectStore('notePads');
        const getRequest = store.get(name);

        getRequest.onsuccess = async (event) => {
            const notePad = event.target.result;
            console.log(event.target);

            if (notePad) {
                const updatedNotePad = { ...notePad, ...newNotePad };
                console.log("Updated notePad:", updatedNotePad);

                const updateRequest = store.put(updatedNotePad);
                updateRequest.onsuccess = () => {
                    console.log(`Block de notas editado correctamente`);
                };
                updateRequest.onerror = (event) => {
                    console.log('Error al actualizar el block de notas', event.target.error);
                };
            } else {
                console.log('No se encontró el block de notas para editar');
            }
        };

        getRequest.onerror = (event) => {
            console.log('Error al obtener el block de notas de la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}


//              ADDS A NOTE TO A NOTEPAD
async function createNote(note, notePadName) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const addRequest = store.add({ ...note, notePadName });

        addRequest.onsuccess = () => {
            console.log('Nota agregada a la base de datos');
        };

        addRequest.onerror = (event) => {
            console.log('Error al agregar la nota a la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}

//                  GET ALL NOTES
async function getNotes(notePadName) {
    try {
        console.log(`getting notes of ${notePadName}`);
        const db = await openDb();
        const transaction = db.transaction('notes', 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('notePadName');
        const getRequest = index.getAll(notePadName);

        return new Promise((resolve, reject) => {
            getRequest.onsuccess = (event) => {
                const notes = event.target.result;
                console.log('Notas obtenidas de la base de datos', notes);
                resolve(notes);
            };

            getRequest.onerror = (event) => {
                console.log('Error al obtener las notas de la base de datos', event.target.error);
                reject([]);
            };
        });
    } catch (error) {
        console.error('Error opening DB:', error);
        return [];  // Retorna un arreglo vacío en caso de error al abrir la DB
    }
}



//              GETS A NOTE BY ITS ID
async function getNote(notePadName, noteId) {
    try {
        const notes = await getNotes(notePadName);
        return notes.filter(note => note.id == noteId)[0].content;
    } catch (error) {
        console.error('Error getting notes:', error);
        return null;
    }
}



//              GETS A NOTE BY ITS ID
async function deleteNotes(notePadName) {
    try {
        const db = await openDb();
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
        };

        getRequest.onerror = (event) => {
            console.log('Error al obtener las notas de la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}



//              DELETES A NOTE BY ITS ID
async function deleteNote(noteId, next) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const deleteRequest = store.delete(noteId);

        deleteRequest.onsuccess = () => {
            console.log('Nota eliminada de la base de datos');
            if (next) {
                next();
            }
        };

        deleteRequest.onerror = (event) => {
            console.log('Error al eliminar la nota de la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}



//             EDITS A NOTE BY ITS ID
async function editNote(noteId, newNote) {
    try {
        const db = await openDb();
        const transaction = db.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        const getRequest = store.get(parseInt(noteId, 10));

        getRequest.onsuccess = async (event) => {
            const note = event.target.result;
            console.log(event.target);

            if (note) {
                const updatedNote = { ...note, ...newNote };
                console.log("Updated note:", updatedNote);

                const updateRequest = store.put(updatedNote);
                updateRequest.onsuccess = () => {
                    console.log(`Nota editada correctamente`);
                };
                updateRequest.onerror = (event) => {
                    console.log('Error al actualizar la nota', event.target.error);
                };
            } else {
                console.log('No se encontró la nota para editar');
            }
        };

        getRequest.onerror = (event) => {
            console.log('Error al obtener la nota de la base de datos', event.target.error);
        };
    } catch (error) {
        console.error('Error opening DB:', error);
    }
}




export {
    getNotePad,
    getNotePadObject,
    editNotePad,
    createNote,
    getNotes,
    deleteNotes,
    deleteNote,
    editNote,
    getNote
}
