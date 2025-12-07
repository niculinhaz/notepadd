import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Editor } from '../../components/ui/editor';
import { Note } from '../../types';

const STORAGE_KEY = '@my_notes_app_final_v3';

export default function NoteDetailScreen() {
  const { noteId } = useLocalSearchParams();
  const isNew = noteId === 'new';

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(isNew);

  useEffect(() => {
    loadNoteData();
  }, [noteId]);

  const loadNoteData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      let loadedNotes: Note[] = jsonValue ? JSON.parse(jsonValue) : [];
      setNotes(loadedNotes);

      if (!isNew) {
        const found = loadedNotes.find(n => n.id === noteId);
        if (found) {
          setTitle(found.title);
          setTag(found.tag);
          setContent(found.content);
          setIsEditing(false);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!title && !content) {
      router.back();
      return;
    }
    const now = new Date().toLocaleDateString('pt-BR');
    let updated = [...notes];
    const noteData = { title: title || 'Sem Título', tag, content, date: now };

    if (!isNew) {
      updated = updated.map(n => n.id === noteId ? { ...n, ...noteData } : n);
    } else {
      updated.unshift({ id: Date.now().toString(), ...noteData });
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    router.back();
  };

  const handleDelete = async () => {
    Alert.alert("Excluir", "Apagar nota?", [
      { text: "Não" },
      { text: "Sim", onPress: async () => {
          const updated = notes.filter(n => n.id !== noteId);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          router.back();
        }}
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#050505' }} edges={['top', 'left', 'right']}>
      <Editor
        title={title} setTitle={setTitle}
        tag={tag} setTag={setTag}
        content={content} setContent={setContent}
        isEditing={isEditing} setIsEditing={setIsEditing}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}