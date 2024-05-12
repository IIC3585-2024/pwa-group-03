import { getNotes, createNote, deleteNotes, deleteNote, editNote } from './indexedDb.js';

const params = new URLSearchParams(window.location.search);
const notePadName = params.get('name');

async function loadNotes() {
    try {
        const notes = await getNotes(notePadName);
        showNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const notePadNameHolder = document.getElementById('notePadNameHolder');
    notePadNameHolder.textContent = notePadName;

    const tittle = document.querySelector('title');
    tittle.textContent = notePadName;

    await loadNotes(); 

    const noteContent = document.getElementById('noteContent');
    const createNoteButton = document.getElementById('createNoteButton');


    const charCount = document.getElementById('charCount');
    const maxLength = 200;
    noteContent.addEventListener('input', (event) => {
        createNoteButton.disabled = !event.target.value;

        const textLength = noteContent.value.length;
        
        charCount.innerHTML = `${textLength}/${maxLength}`;
        console.log(textLength, maxLength);
        createNoteButton.disabled = textLength === 0 || textLength > maxLength;

    });

    createNoteButton.addEventListener('click', async () => {
        const note = {
            content: noteContent.value,
        };
        await createNote(note, notePadName);
        noteContent.value = '';
        await loadNotes();
        createNoteButton.disabled = true;
    });

    const deleteAllButton = document.getElementById('deleteAllButton');
    deleteAllButton.addEventListener('click', async () => {
        await deleteNotes(notePadName);
        await loadNotes();
    });

    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', () => {
        location.reload();
    });
});

function showNotes(notes) {
    const notesTbody = document.querySelector('#notesContainer tbody');
    notesTbody.innerHTML = ''; 

    notes.forEach(note => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td class="truncate text-ellipsis">${note.content}</td>
        <td>
            <button class="edit btn btn-xs btn-outline btn-secondary">Edit</button>
        </td>
        <td>
            <button class="delete btn btn-xs btn-outline btn-error">Delete</button>
        </td>
        <td>
            <input type="checkbox" class="checkbox" ${note.checked ? 'checked' : ''} />
        </td>
    `;
    

        const editButton = row.querySelector('.edit');
        const deleteButton = row.querySelector('.delete');
        const checkbox = row.querySelector('.checkbox');

        editButton.addEventListener('click', () => {
            window.location.href = '/editNote.html?name=' + notePadName + '&id=' + note.id;
        });

        deleteButton.addEventListener('click', async () => {
            await deleteNote(note.id);
            await loadNotes(); 
        });

        checkbox.addEventListener('change', async () => {
            await editNote(note.id, { checked: checkbox.checked });
        });

        notesTbody.appendChild(row);
    });
}

