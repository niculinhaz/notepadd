import { Note } from '@/type';
import * as SQLite from 'expo-sqlite';

export async function initDatabase(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY NOT NULL, 
            title TEXT NOT NULL, 
            tag TEXT NOT NULL, 
            content TEXT, 
            date STRING NOT NULL
        );
    `);
}

export async function insertNote(db: SQLite.SQLiteDatabase, note: Note) {
    await db.runAsync('INSERT INTO notes (id, title, tag, content, date) VALUES (?, ?, ?, ?, ?);', 
        note.id, note.title.trim(), note.tag.trim().toUpperCase(), note.content, note.date
    );
}

export async function updateNote(db: SQLite.SQLiteDatabase, note: Note) {
    await db.runAsync('UPDATE notes SET title = ?, tag = ?, content = ?, date = ? WHERE id = ?',
        note.title.trim(), note.tag.trim().toUpperCase(), note.content, note.date, note.id
    );
}

export async function getAllNotes(db: SQLite.SQLiteDatabase): Promise<Note[]> {
    const allNotes = await db.getAllAsync<Note>('SELECT * FROM notes');

    return allNotes;
}

export async function getNoteById(db: SQLite.SQLiteDatabase, id: string): Promise<Note | null> {
    const note = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', id);

    return note;
}

export async function deleteNoteById(db: SQLite.SQLiteDatabase, id: string) {
    await db.runAsync('DELETE FROM notes WHERE id = ?', id);
}

export async function deleteNotesBulk(db: SQLite.SQLiteDatabase, ids: string[]) {
    if (ids.length === 0) return;
    const placeholders = ids.map(() => '?').join(',');
    await db.runAsync(`DELETE FROM notes WHERE id IN (${placeholders})`, ids);
}

export async function deleteTags(db: SQLite.SQLiteDatabase, tag: string) {
    await db.runAsync('UPDATE notes SET tag = ? WHERE tag = ?',
        '', tag.trim().toUpperCase()
    );
}