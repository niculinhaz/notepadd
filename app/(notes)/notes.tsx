import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/StyledText';
import { deleteNotesBulk, deleteTags, getAllNotes } from '@/database/database';
import { Note } from '@/type';
import { useSQLiteContext } from 'expo-sqlite';
import { FilterDrawer } from '../../components/ui/filter-drawer';
import { NoteCard } from '../../components/ui/note-card';
import { useThemeStyles } from '../../constants/theme';
import { useThemeContext } from '../_layout';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Todas as notas');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  
  const isSelectionMode = selectedIds.length > 0;
  
  const db = useSQLiteContext();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
      const onBackPress = () => {
        if (isSelectionMode) {
          setSelectedIds([]); 
          return true; 
        }
        return false; 
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [isSelectionMode])
  );

  const loadNotes = async () => {
    try {
      const fetchedNotes = await getAllNotes(db);
      console.log(fetchedNotes);
      setNotes(fetchedNotes || []);
    } 
    catch (e) { console.error(e); }
  };

  const handleLongPress = (id: string) => {
    if (!isSelectionMode) setSelectedIds([id]);
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteButtonPress = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNotesBulk(db, selectedIds);
      setSelectedIds([]); 
      setShowDeleteModal(false); 
      loadNotes();
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
      if(!isNaN(timeA) && !isNaN(timeB)) {
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      }
      return 0; 
    });
    return result;
  };

  const handleDeleteTags = async (tag: string) => {
    await deleteTags(db, tag);
    await loadNotes();
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
        onDeleteTags={handleDeleteTags}
      />

      <View style={styles.headerTop}>
        {isSelectionMode ? (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <TouchableOpacity onPress={() => setSelectedIds([])}>
                 <Feather name="x" size={24} color={iconColor} />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: iconColor }}>
                {selectedIds.length}
              </Text>
            </View>
            <TouchableOpacity onPress={handleDeleteButtonPress}>
              <Feather name="trash-2" size={24} color="#cf6679" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchBarContainer, { opacity: isSelectionMode ? 0.3 : 1 }]}>
          <Feather name="search" size={20} color={iconSecColor} />
          <TextInput 
            style={[styles.searchInput, { fontFamily: 'SF-Pro' }]} 
            placeholder="pesquisar" 
            placeholderTextColor={iconSecColor} 
            value={searchText} 
            onChangeText={setSearchText} 
            editable={!isSelectionMode} 
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} disabled={isSelectionMode}>
              <Feather name="x" size={20} color={iconSecColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{selectedTag} ({filteredNotes.length})</Text>
        <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            disabled={isSelectionMode}
        >
            <Feather name={sortOrder === 'desc' ? "arrow-down" : "arrow-up"} size={12} color={iconSecColor} />
            <Text style={[styles.sortText, { fontFamily: 'SF-Pro' }]}>
              data de criação
            </Text>
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
          renderItem={({ item }) => (
            <NoteCard 
              item={item}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(item.id)}
              onLongPress={handleLongPress}
              onSelect={handleToggleSelect}
            />
          )}
        />
      )}

      {!isSelectionMode && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/(notes)/new')}>
          <Feather name="plus" size={32} color={isDarkMode ? '#000' : '#fff'} />
        </TouchableOpacity>
      )}

      {}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalCenterOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Excluir Nota(s): 
            </Text>
            
            <Text style={styles.modalText}>
              Tem certeza que deseja apagar {selectedIds.length} nota(s) permanentemente?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowDeleteModal(false)}
                style={styles.btnCancel}
              >
                <Text style={styles.btnTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={confirmDelete}
                style={styles.btnDelete}
              >
                <Text style={styles.btnTextDelete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}