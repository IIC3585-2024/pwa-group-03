import { getNotes, createNote } from './indexedDb.js';

const params = new URLSearchParams(window.location.search);
const notePadName = params.get('name');

document.addEventListener('DOMContentLoaded', function() {
    const notePadNameHolder = document.getElementById('notePadNameHolder');
    notePadNameHolder.textContent = notePadName;

    getNotes(notePadName);

    const noteContent = document.getElementById('noteContent');
    const createNoteButton = document.getElementById('createNoteButton');
    createNoteButton.addEventListener('click', () => {
        const note = {
            content: noteContent.value,
        };
        createNote(note, notePadName);
        noteContent.value = '';
        getNotes(notePadName);
    });
});