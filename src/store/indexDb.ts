import { Message } from '../scripts/message';
import { handleError } from '../utils/handleError';

let db: IDBDatabase | null = null;
let dbPromise: Promise<void> | null = null;

export const initDataBase = (): Promise<void> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('messages', 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains('messages')) {
        database.createObjectStore('messages', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onblocked = () => {
      handleError('dbBlocked');
    };

    request.onsuccess = () => {
      db = request.result;

      db.onversionchange = () => {
        db?.close();
        handleError('dbVersionChanged');
      };

      resolve();
    };

    request.onerror = () => {
      reject(new Error('dbStartError'));
    };
  });

  return dbPromise;
};

export const addMessage = (message: Omit<Message, 'id'>): Promise<void> => {
  if (!db) return new Promise((_, reject) => reject(new Error('dbNotInit')));

  const tx = db.transaction('messages', 'readwrite');
  const store = tx.objectStore('messages');

  return new Promise((resolve, reject) => {
    const request = store.add(message);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(new Error('addMessageError'));
  });
};

export const getMessages = (): Promise<Message[] | void> => {
  if (!db) return new Promise((_, reject) => reject(new Error('dbNotInit')));

  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('getMessagesError'));
  });
};
