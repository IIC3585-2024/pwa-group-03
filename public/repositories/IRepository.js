// IRepository.js
export default class IRepository {

    // NOTEPAD METHODS
    async createNotepad(notePad) {
        throw new Error("Method 'create' must be implemented.");
    }

    async getNotePad(name) {
        throw new Error("Method 'read' must be implemented.");
    }

    // NOTE METHODS
    async createNote(note, notePadName) {
        throw new Error("Method 'create' must be implemented.");
    }

    async getNotes(notePadName) {
        throw new Error("Method 'update' must be implemented.");
    }

    async getNote(notePadName, noteId) {
        throw new Error("Method 'read' must be implemented.");
    }

    async editNote(noteId, newNote)  {
        throw new Error("Method 'update' must be implemented.");
    }

    async deleteNotes(notePadName) {
        throw new Error("Method 'delete' must be implemented.");
    }

    async deleteNote(noteId, next) {
        throw new Error("Method 'delete' must be implemented.");
    }

}
