import IRepository from './IRepository.js';
import {
    getNotepad,
    addNotepad,
    getNotes,
    getNote,
    addNote,
    deleteNote,
    deleteNotes,
    editNote
} from '../scripts/firebaseDb.js';

export default class FirebaseDBRepository extends IRepository {
    constructor() {
        super();
    }
   // NOTEPAD METHODS
   async createNotepad(notePad) {
        console.log('Creating notepad');
        return addNotepad(notePad);
    }

    async getNotePad(name) {
        return getNotepad(name);
    }

    // NOTE METHODS
    async createNote(note, notePadName) {
        return addNote(note, notePadName);
    }

    async getNotes(notePadName) {
        return getNotes(notePadName);
    }   

    async getNote(notePadName, noteId) {
        return getNote(notePadName, noteId);
    }

    async editNote(noteId, newNote, notepadName)  {
        return editNote(noteId, newNote, notepadName);
    }

    async deleteNotes(notePadName) {
        return deleteNotes(notePadName);
    }

    async deleteNote(noteId, notepadName) {
        return deleteNote(noteId, notepadName);
    }
}