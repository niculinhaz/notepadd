import React, { useState, useCallback } from 'react';
import { 
  View as RNView,  
  TouchableOpacity,
  FlatList, 
  TextInput,
  View,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';

import { Text } from '@/components/ui/StyledText';
import { useThemeStyles } from '../../constants/theme';
import { useThemeContext } from '../_layout';
import { NoteCard } from '../../components/ui/note-card';
import { FilterDrawer } from '../../components/ui/filter-drawer';
import { Note } from '../../types/index';

const STORAGE_KEY = '@my_notes_app_final_v3';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Todas as notas');

  const { isDarkMode, toggleTheme } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);

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

  const filteredNotes = getFilteredNotes();
  const iconColor = isDarkMode ? '#fff' : '#000';
  const iconSecColor = isDarkMode ? '#666' : '#888';
  
  const placeholderColor = isDarkMode ? '#555' : '#aaa';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      <FilterDrawer 
        visible={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        tags={getTagsWithCounts()} 
        selectedTag={selectedTag} 
        onSelectTag={handleSelectTag}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={styles.menuBtn}>
           <Feather name="menu" size={28} color={iconColor} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'flex-end'}}>
        <Image 
          source={isDarkMode 
            ? require('../../assets/images/notepaddlogo.png')
            : require('../../assets/images/notepaddlogolight.png')
          } 
          style={{ width: 160, height: 40 }}
          resizeMode="contain"
        />
        </View> 
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={20} color={iconSecColor} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="pesquisar" 
            placeholderTextColor={iconSecColor} 
            value={searchText} 
            onChangeText={setSearchText} 
          />
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{selectedTag} ({filteredNotes.length})</Text>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
            <Feather name={sortOrder === 'desc' ? "arrow-down" : "arrow-up"} size={12} color={iconSecColor} />
            <Text style={styles.sortText}>data de criação</Text>
        </TouchableOpacity>
      </View>

      {filteredNotes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
          <Text style={{ 
            color: placeholderColor, 
            fontSize: 18, 
            textAlign: 'center', 
            lineHeight: 28,
            fontWeight: '500'
          }}>
            você não criou{'\n'}nenhuma nota ainda :(
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => <NoteCard item={item} />}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(notes)/new')}>
        <Feather name="plus" size={32} color={isDarkMode ? '#000' : '#fff'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}