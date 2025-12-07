import React, { useState, useEffect } from 'react';
import {TextInput, TouchableOpacity,ScrollView, KeyboardAvoidingView, Platform, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import tamaguiConfig from '../../tamagui.config'; 
import { styles, markdownStyles } from './styles';
import { TamaguiProvider, Text, View, useTheme,} from 'tamagui'; 

interface Note {
  id: string;
  title: string;
  tag: string;
  content: string;
  date: string;
}
// Chave aleatoria de armazenamento que eu escolhi
const STORAGE_KEY = '@notepadd_notas';

type NotesAppContentProps = {
  themeName: 'light' | 'dark';
  setThemeName: (t: 'light' | 'dark') => void;
};

const NotesAppContent = ({ themeName, setThemeName }: NotesAppContentProps) => {

  const theme = useTheme(); 

  const [view, setView] = useState<'list' | 'editor'>('list');
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [searchText, setSearchText] = useState('');
  const [filterTag, setFilterTag] = useState<string>('Todos');

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => { loadNotes(); }, []);

  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newTheme);
  };
 
  const getUniqueTags = () => {
    const tags = notes
      .map(note => note.tag)
      .filter(t => t.trim() !== '')
      .map(t => t.trim());
    return ['Todos', ...Array.from(new Set(tags))];
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = filterTag === 'Todos' || note.tag.trim() === filterTag;
    return matchesSearch && matchesTag;
  });

  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue) setNotes(JSON.parse(jsonValue));
    } catch (e) { console.error(e); }
  };

  const saveToStorage = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) { console.error(e); }
  };

  const openNote = (note: Note) => {
    setCurrentId(note.id);
    setTitle(note.title);
    setTag(note.tag);
    setContent(note.content);
    setIsEditingMode(false);
    setView('editor');
  };

  const createNewNote = () => {
    setCurrentId(null);
    setTitle('');
    setTag('');
    setContent('');
    setIsEditingMode(true);
    setView('editor');
  };

  const saveAndClose = () => {
    if (!title && !content && !currentId) {
      setView('list');
      return;
    }

    const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    let updatedNotes = [...notes];

    if (currentId) {
      updatedNotes = updatedNotes.map(n => 
        n.id === currentId ? { ...n, title, tag, content, date: now } : n
      );
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title || 'Nota',
        tag,
        content,
        date: now
      };
      updatedNotes.unshift(newNote);
    }

    saveToStorage(updatedNotes);
    setView('list');
  };

  const deleteNote = () => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar" },
      { 
        text: "Excluir", style: "destructive", 
        onPress: () => {
          const updatedNotes = notes.filter(n => n.id !== currentId);
          saveToStorage(updatedNotes);
          setView('list');
        }
      }
    ]);
  };

  const handleFormat = (prefix: string, suffix: string) => {
    const { start, end } = selection;
    const newText = content.substring(0, start) + prefix + content.substring(start, end) + suffix + content.substring(end);
    setContent(newText);
  };

  const BotaoFerramenta = ({ label, onPress }: any) => (
    <TouchableOpacity style={styles.toolBtn} onPress={onPress}>
      <Text style={[styles.toolBtnText, { color: theme.color.val }]}>{label}</Text>
    </TouchableOpacity>
  );

  if (view === 'list') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background.val }]}>
        <View style={styles.homeHeader}>
          
          {/* HEADER COM O TÍTULO */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={[styles.homeTitle, { color: theme.color.val }]}>Notepadd</Text>
            
            {/* BOTÃO DO MODO ESCURO/CLARO */}
            <TouchableOpacity 
                style={{ 
                    padding: 8, 
                    borderRadius: 6, 
                    backgroundColor: theme.backgroundStrong.val, 
                }}
                onPress={toggleTheme}
            >
                <Text style={{ color: theme.color.val, fontWeight: "600" }}>
                    {themeName === "dark" ? "☀️ Claro" : "🌙 Escuro"}
                </Text>
            </TouchableOpacity>
          </View>
            
          {/* CAMPO DE BUSCA */}
          <TextInput 
            style={[styles.searchBar, { 
                borderColor: theme.borderColor.val, 
                color: theme.color.val, 
                backgroundColor: theme.backgroundStrong.val 
            }]}
            placeholder="pesquisar..."
            placeholderTextColor={theme.color8.val}
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* LISTA DE FILTROS */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filtersContainer}
          >
            {getUniqueTags().map((tagName, index) => {
              const isSelected = filterTag === tagName;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                      styles.filterChip, 
                      { 
                          backgroundColor: isSelected ? theme.blue9.val : theme.backgroundStrong.val,
                          borderColor: isSelected ? theme.blue10.val : theme.borderColor.val,
                      }
                  ]}
                  onPress={() => setFilterTag(tagName)}
                >
                  <Text 
                      style={[
                          styles.filterText, 
                          { color: isSelected ? theme.color.val : theme.color10.val }
                      ]}
                  >
                    {tagName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* LISTA DE NOTAS */}
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <Text style={{ color: theme.color8.val, textAlign: 'center', marginTop: 50 }}>
              {notes.length === 0 ? "Nenhuma nota criada." : "Nenhuma nota encontrada."}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={[styles.noteCard, { backgroundColor: theme.backgroundStrong.val, borderColor: theme.borderColor.val }]} 
                onPress={() => openNote(item)}
            >
              <View>
                <Text style={[styles.noteCardTitle, { color: theme.color.val }]} numberOfLines={1}>
                    {item.title || 'Nota'}
                </Text>
                <Text style={[styles.noteCardPreview, { color: theme.color9.val }]} numberOfLines={3} ellipsizeMode="tail">
                    {item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : ''}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                {item.tag ? (
                  <View style={[styles.tagBadge, { backgroundColor: theme.yellow6.val }]}>
                    <Text style={[styles.tagText, { fontSize: 9, color: theme.yellow12.val }]}>{item.tag}</Text>
                  </View>
                ) : <View />}
                <Text style={[styles.noteDate, { color: theme.color8.val }]}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* FAB */}
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.blue10.val }]} onPress={createNewNote}>
          <Text style={[styles.fabText, { color: theme.color.val }]}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.val }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={saveAndClose} style={styles.backBtn}>
            <Text style={[styles.backBtnText, { color: theme.color.val }]}>{'< Voltar'}</Text>
          </TouchableOpacity>

          <View style={styles.headerButtons}>
            {currentId && (
              <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.red7.val }]} onPress={deleteNote}>
                <Text style={[styles.clearBtnText, { color: theme.color.val }]}>Excluir</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={{ 
                backgroundColor: isEditingMode ? theme.green9.val : theme.blue9.val, 
                padding: 8, 
                borderRadius: 6 
              }}
              onPress={() => setIsEditingMode(!isEditingMode)}
            >
              <Text style={{ color: theme.color.val, fontWeight: 'bold' }}>{isEditingMode ? 'Concluir' : 'Editar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {isEditingMode ? (
            <>
              <View style={styles.editorPane}>
                <View style={styles.inputsContainer}>
                  <TextInput 
                    style={[styles.inputTitle, { color: theme.color.val, borderColor: theme.borderColor.val }]} 
                    placeholder="Título..." 
                    placeholderTextColor={theme.color8.val} 
                    value={title} 
                    onChangeText={setTitle} 
                  />
                  <TextInput 
                    style={[styles.inputTag, { color: theme.color.val, borderColor: theme.borderColor.val }]} 
                    placeholder="Tag" 
                    placeholderTextColor={theme.color8.val} 
                    value={tag} 
                    onChangeText={setTag} 
                  />
                </View>
                <TextInput
                  style={[styles.textArea, { color: theme.color.val, backgroundColor: theme.backgroundStrong.val }]} 
                  multiline 
                  placeholder="digite aqui..." 
                  placeholderTextColor={theme.color7.val}
                  value={content} 
                  onChangeText={setContent}
                  onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                  autoFocus
                />
              </View>
              <View style={{ height: 60 }}>
                <ScrollView horizontal style={[styles.toolbar, { backgroundColor: theme.backgroundStrong.val }]} contentContainerStyle={styles.toolbarContent} keyboardShouldPersistTaps="always">
                  <BotaoFerramenta label="B" onPress={() => handleFormat('**', '**')} />
                  <BotaoFerramenta label="I" onPress={() => handleFormat('*', '*')} />
                  <BotaoFerramenta label="H1" onPress={() => handleFormat('# ', '')} />
                  <BotaoFerramenta label="H2" onPress={() => handleFormat('## ', '')} />
                  <BotaoFerramenta label="Lista" onPress={() => handleFormat('\n- ', '')} />
                  <BotaoFerramenta label="Code" onPress={() => handleFormat('`', '`')} />
                </ScrollView>
              </View>
            </>
          ) : (
            <ScrollView style={styles.previewPane}>
              {title !== '' && <Text style={[styles.previewTitle, { color: theme.color.val }]}>{title}</Text>}
              {tag !== '' && <View style={[styles.tagBadge, { backgroundColor: theme.yellow6.val }]}><Text style={[styles.tagText, { color: theme.yellow12.val }]}>{tag}</Text></View>}
              <Markdown style={markdownStyles}>{content || '*Nota vazia*'}</Markdown>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default function App() {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
      <NotesAppContent themeName={themeName} setThemeName={setThemeName} />
    </TamaguiProvider>
  );
}