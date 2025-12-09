import { Text } from '@/components/ui/StyledText';
import * as Crypto from 'expo-crypto';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteNoteById, getNoteById, insertNote, updateNote } from '@/database/database';
import { Editor } from '../../components/ui/editor';
import { useThemeStyles } from '../../constants/theme';
import { useThemeContext } from '../_layout';

const { width } = Dimensions.get('window');

export default function NoteDetailScreen() {
  const { noteId } = useLocalSearchParams();
  
  const initialId = Array.isArray(noteId) ? noteId[0] : noteId;
  const [currentId, setCurrentId] = useState(initialId);
  
  const isNew = currentId === 'new';

  const { isDarkMode } = useThemeContext();
  const globalStyles = useThemeStyles(isDarkMode);

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(isNew);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const db = useSQLiteContext();

  useEffect(() => {
    loadNoteData();
  }, [currentId]);

  const loadNoteData = async () => {
    try {
      if (!isNew) {
        const note = await getNoteById(db, currentId);
        if (note) {
          setTitle(note.title);
          setTag(note.tag);
          setContent(note.content);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleSave = async (newContent: string, finishEditing: () => void) => {
    if (!title && !newContent) {
      router.back();
      return;
    }

    const noteData = {
      title: title || 'Sem Título', 
      tag, 
      content: newContent,
      date: new Date().toLocaleDateString('pt-BR')
    };

    if (!isNew) {
      await updateNote(db, {
        id: currentId,
        ...noteData
      });
    } 
    else {
      const newId = Crypto.randomUUID();
      
      await insertNote(db, {
        id: newId,
        ...noteData
      });
      
      setCurrentId(newId);
    }
    setContent(newContent);
    finishEditing();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNoteById(db, currentId);
      setShowDeleteModal(false);
      router.back();
    } 
    catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  };

  const modalColors = {
    overlay: 'rgba(0,0,0,0.7)',
    bg: isDarkMode ? '#1e1e1e' : '#ffffff',
    title: isDarkMode ? '#fff' : '#000',
    text: isDarkMode ? '#ccc' : '#666',
    border: isDarkMode ? '#333' : '#e0e0e0',
    cancelBtn: isDarkMode ? '#333' : '#f0f0f0',
    cancelText: isDarkMode ? '#fff' : '#000',
    deleteBtn: '#cf6679', 
    deleteText: '#fff'
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <Editor
        title={title} setTitle={setTitle}
        tag={tag} setTag={setTag}
        content={content} setContent={setContent}
        isEditing={isEditing} setIsEditing={setIsEditing}
        onSave={(newContent) => handleSave(newContent, () => setIsEditing(false))}
        onDelete={handleDelete}
        onExit={() => {
          setIsEditing(false);
          router.back();
        }}
      />

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: modalColors.overlay, 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            width: width * 0.85,
            backgroundColor: modalColors.bg,
            borderRadius: 12,
            padding: 24,
            borderWidth: 1,
            borderColor: modalColors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: modalColors.title,
              marginBottom: 10,
              fontFamily: 'SF-Pro'
            }}>
              Excluir Nota 
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: modalColors.text,
              marginBottom: 24,
              lineHeight: 22,
              fontFamily: 'SF-Pro'
            }}>
              Tem certeza que deseja apagar esta nota permanentemente?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity 
                onPress={() => setShowDeleteModal(false)}
                style={{
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: modalColors.cancelBtn,
                }}
              >
                <Text style={{ 
                  color: modalColors.cancelText, 
                  fontWeight: 'regular',
                  fontFamily: 'SF-Pro'
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={confirmDelete}
                style={{
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: modalColors.deleteBtn,
                }}
              >
                <Text style={{ 
                  color: modalColors.deleteText, 
                  fontWeight: 'bold',
                  fontFamily: 'SF-Pro'
                }}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}