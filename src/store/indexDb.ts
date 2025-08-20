import { Message } from '../scripts/message';
import { handleError } from '../utils/handleError';

let db: IDBDatabase | null = null;
let dbPromise: Promise<void> | null = null;
let PAGE_SIZE = 20;

export const initDataBase = (pageSize = 20): Promise<void> => {
  if (dbPromise) return dbPromise;

  PAGE_SIZE = pageSize;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('messages', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const database = request.result;

      if (event.oldVersion < 1) {
        const store = database.createObjectStore('messages', {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('id_idx', 'id', { unique: true });
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

export const getAllMessages = (): Promise<Message[] | void> => {
  if (!db) return new Promise((_, reject) => reject(new Error('dbNotInit')));

  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('getMessagesError'));
  });
};

export async function getMessagesPage(
  before?: number,
): Promise<{ messages: Message[]; hasMore: boolean }> {
  if (!db) return new Promise((_, reject) => reject(new Error('dbNotInit')));

  const tx = db.transaction('messages', 'readonly');
  const store = tx.objectStore('messages');
  const index = store.index('id_idx');

  const range = before ? IDBKeyRange.upperBound(before, true) : null;
  const messages: Message[] = [];
  let count = 0;

  return new Promise<{ messages: Message[]; hasMore: boolean }>(
    (resolve, reject) => {
      const request = index.openCursor(range, 'prev');

      request.onsuccess = () => {
        const cursor: IDBCursorWithValue | null = request.result;

        if (cursor && count < PAGE_SIZE) {
          messages.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          const hasMore = Boolean(cursor);

          resolve({ messages, hasMore });
        }
      };

      request.onerror = () => reject(new Error('getMessagesError'));
    },
  );
}
