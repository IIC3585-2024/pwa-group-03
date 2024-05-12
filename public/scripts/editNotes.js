import { editNote, getNote } from './indexedDb.js';
import RepositoryFactory from '../repositories/RepositoryFactory.js';

const params = new URLSearchParams(window.location.search);
const notePadName = params.get('name');
const noteId = params.get('id');

document.addEventListener('DOMContentLoaded', async function() {
    const noteContent = document.getElementById('noteContent');
    noteContent.className = 'input input-bordered w-full max-w-xs';
    // const previousValue = await getNote(notePadName, noteId);
    const repo = RepositoryFactory.getRepository(); //*
    const previousValue = await repo.getNote(notePadName, noteId); //*
    noteContent.value = previousValue
    
    const editButton = document.getElementById('editNoteButton');
    editButton.addEventListener('click', async () => {
        const newNoteContent = document.getElementById('noteContent').value;
        // await editNote(noteId, { content: newNoteContent });
        const repo = RepositoryFactory.getRepository(); //*
        await repo.editNote(noteId, { content: newNoteContent }, notePadName); //*
        window.location.href = '/notePads.html?name=' + notePadName;
    });

    const cancelButton = document.getElementById('cancelEditNoteButton');
    cancelButton.addEventListener('click', () => {
        window.location.href = '/notePads.html?name=' + notePadName;
    });
});

