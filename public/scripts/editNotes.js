import { editNote, getNote, deleteNote } from './indexedDb.js';

const params = new URLSearchParams(window.location.search);
const notePadName = params.get('name');
const noteId = params.get('id');

document.addEventListener('DOMContentLoaded', function() {
    const noteContent = document.getElementById('noteContent');
    noteContent.className = 'input input-bordered w-full max-w-xs';
    noteContent.innerHTML = getNote(notePadName, noteId, showNote);

    const editButton = document.getElementById('editNoteButton');
    editButton.addEventListener('click', () => {
        const newNoteContent = document.getElementById('noteContent');
        editNote(noteId, newNoteContent);
        window.location.href = '/notePads.html?name=' + notePadName;
    });

    const cancelButton = document.getElementById('cancelEditNoteButton');
    cancelButton.addEventListener('click', () => {
        window.location.href = '/notePads.html?name=' + notePadName;
    });

    const deleteButton = document.getElementById('deleteNoteButton');
    deleteButton.addEventListener('click', () => {
        deleteNote(noteId, () => {
            window.location.href = '/notePads.html?name=' + notePadName;
        });
    });
});

function showNote(note) {
    return note.content;
}