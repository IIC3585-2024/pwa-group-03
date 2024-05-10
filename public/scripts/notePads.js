import { getNotes, createNote, deleteNotes, deleteNote, editNote } from './indexedDb.js';


const params = new URLSearchParams(window.location.search);
const notePadName = params.get('name');

document.addEventListener('DOMContentLoaded', function() {
    const notePadNameHolder = document.getElementById('notePadNameHolder');
    notePadNameHolder.textContent = notePadName;
    const tittle = document.querySelector('title');
    tittle.textContent = notePadName;

    getNotes(notePadName, showNotes);

    const noteContent = document.getElementById('noteContent');
    const createNoteButton = document.getElementById('createNoteButton');

    noteContent.addEventListener('input', (event) => {
        createNoteButton.disabled = !event.target.value;
    });

    createNoteButton.addEventListener('click', () => {
        const note = {
            content: noteContent.value,
        };
        createNote(note, notePadName);
        noteContent.value = '';
        getNotes(notePadName, showNotes);
        createNoteButton.disabled = true;
    });

    const deleteAllButton = document.getElementById('deleteAllButton');
    deleteAllButton.addEventListener('click', () => {
        deleteNotes(notePadName);
        getNotes(notePadName, showNotes);
    });

    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', () => {
        this.location.reload();
    });
});


function showNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <div class="note-actions shadow-2xl min-w-full">
                <p>${note.content}</p>
                <div class="buttons">
                    <button class="edit btn-circle btn-outline btn-secondary">Edit</button>
                    <button class="delete btn-circle btn-outline btn-error">Delete</button>
                    <input type="checkbox" class="checkbox" />
                </div>
                <div class="divider divider-horizontal"></div>
            </div>
        `;
        const editButton = noteElement.querySelector('.edit');
        const deleteButton = noteElement.querySelector('.delete');
        const checkedNote = noteElement.querySelector('.checkbox');

        // editButton.addEventListener('click', () => {
        //     const newNoteContent = document.getElementById('noteContent');
        //     const newNote = {
        //         content: newNoteContent.value,
        //     };
        //     editNote(note.id, newNote);
        //     newNoteContent.value = '';
        //     getNotes(notePadName, showNotes);
        // });
        editButton.addEventListener('click', () => {
            window.location.href = '/editNote.html?name=' + notePadName + '&id=' + note.id;
        });
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
            getNotes(notePadName, showNotes);
        });
        checkedNote.addEventListener('change', () => {
            if (checkedNote.checked) {
                // set random color
                noteElement.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            }
            else {
                noteElement.style.backgroundColor = '#fff';
            }
        });

        notesContainer.appendChild(noteElement);
    });
}
