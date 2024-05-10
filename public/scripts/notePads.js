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
    createNoteButton.addEventListener('click', () => {
        const note = {
            content: noteContent.value,
        };
        createNote(note, notePadName);
        noteContent.value = '';
        getNotes(notePadName, showNotes);
    });

    const deleteAllButton = document.getElementById('deleteAllButton');
    deleteAllButton.addEventListener('click', () => {
        deleteNotes(notePadName);
        getNotes(notePadName, showNotes);
    });
});


function showNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        const editButton = noteElement.querySelector('.edit');
        const deleteButton = noteElement.querySelector('.delete');

        editButton.addEventListener('click', () => {
            const newNoteContent = document.getElementById('noteContent');
            const newNote = {
                content: newNoteContent.value,
            };
            editNote(note.id, newNote);
            newNoteContent.value = '';
            getNotes(notePadName, showNotes);
        });
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
            getNotes(notePadName, showNotes);
        });

        notesContainer.appendChild(noteElement);
    });
}
