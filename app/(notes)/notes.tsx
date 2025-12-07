import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';

import { styles } from '../../constants/theme';
import { NoteCard } from '../../components/ui/note-card';
import { FilterDrawer } from '../../components/ui/filter-drawer';
import { Note } from '../../types';

const STORAGE_KEY = '@my_notes_app_final_v3';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Todas as notas');

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) setNotes(JSON.parse(jsonValue));
    } catch (e) { console.error(e); }
  };

  const getTagsWithCounts = () => {
    const counts: Record<string, number> = { 'Todas as notas': notes.length };
    notes.forEach(note => {
      const t = note.tag ? note.tag.trim() : 'Sem tag';
      if (t) counts[t] = (counts[t] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  };

  const handleSelectTag = (tagName: string) => {
    setSelectedTag(tagName);
    setIsDrawerOpen(false);
  };

  const getFilteredNotes = () => {
    let result = notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesTag = selectedTag === 'Todas as notas' || 
                         (selectedTag === 'Sem tag' && !note.tag) || 
                         note.tag === selectedTag;
      return matchesSearch && matchesTag;
    });

    result.sort((a, b) => {
      const timeA = Number(a.id);
      const timeB = Number(b.id);
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
    return result;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <FilterDrawer 
        visible={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        tags={getTagsWithCounts()} 
        selectedTag={selectedTag} 
        onSelectTag={handleSelectTag} 
      />

      {/* HEADER */}
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={styles.menuBtn}>
           <Feather name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appLogo}>notepadd</Text>
        <View style={{width: 28}} /> 
      </View>

      {/* BUSCA (SEM ÍCONE DE FILTRO) */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={20} color="#666" />
          <TextInput 
            style={styles.searchInput} placeholder="pesquisar" placeholderTextColor="#666" 
            value={searchText} onChangeText={setSearchText} 
          />
        </View>
      </View>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{selectedTag} ({getFilteredNotes().length})</Text>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
            <Feather name={sortOrder === 'desc' ? "arrow-down" : "arrow-up"} size={12} color="#666" />
            <Text style={styles.sortText}>data de criação</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={getFilteredNotes()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notesList}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => <NoteCard item={item} />}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(notes)/new')}>
        <Feather name="plus" size={32} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}