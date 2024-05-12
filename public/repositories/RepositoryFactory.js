import IndexedDBRepository from './IndexedDBRepository.js';
import FirebaseRepository from './FirebaseRepository.js';
import { SimulatedConnection } from '../scripts/connection.js';

export default class RepositoryFactory {
    static getRepository() {
        if (SimulatedConnection.isConnected) {
            console.log('Using FirebaseRepository');
            return new FirebaseRepository();
        } else {
            console.log('Using IndexedDBRepository');
            return new IndexedDBRepository();
        }
    }
}