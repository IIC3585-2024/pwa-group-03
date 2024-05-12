import IRepository from './IRepository.js';
import {
    createNotePad,
    getNotePad,
    createNote,
    getNotes,
    getNote,
    deleteNotes,
    deleteNote,
    editNote
} from '../scripts/indexedDb.js';

export default class IndexedDBRepository extends IRepository {
    constructor() {
        super();
    }
   // NOTEPAD METHODS
   async createNotepad(notePad) {
        return getNotePad(notePad);
    }

    async getNotePad(name) {
        return getNotePad(name);
    }

    // NOTE METHODS
    async createNote(note, notePadName) {
        return createNote(note, notePadName);
    }

    async getNotes(notePadName) {
        return getNotes(notePadName);
    }   

    async getNote(notePadName, noteId) {
        return getNote(notePadName, noteId);
    }

    async editNote(noteId, newNote)  {
        return editNote(noteId, newNote);
    }

    async deleteNotes(notePadName) {
        return deleteNotes(notePadName);
    }

    async deleteNote(noteId, next) {
        return deleteNote(noteId, next);
    }
}