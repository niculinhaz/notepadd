import React, { useState, useEffect } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, SafeAreaView, 
  ScrollView, KeyboardAvoidingView, Platform, Alert, FlatList 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import { styles, markdownStyles } from './styles';

interface Note {
  id: string;
  title: string;
  tag: string;
  content: string;
  date: string;
}

const STORAGE_KEY = '@my_notes_app_v3_grid';

export default function App() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Estados de Filtro e Busca
  const [searchText, setSearchText] = useState('');
  const [filterTag, setFilterTag] = useState<string>('Todos'); // 'Todos' mostra tudo

  // Estados do Editor
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => { loadNotes(); }, []);

  // --- LÓGICA DE FILTRAGEM ---
  
  // 1. Pega todas as tags que existem nas notas (sem repetir)
  const getUniqueTags = () => {
    const tags = notes
      .map(note => note.tag)      // Pega só o campo tag
      .filter(t => t.trim() !== '') // Remove vazios
      .map(t => t.trim());        // Remove espaços extras
    
    // Set remove duplicatas automaticamente
    return ['Todos', ...Array.from(new Set(tags))];
  };

  // 2. Cria a lista filtrada baseada na Busca E na Tag selecionada
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = filterTag === 'Todos' || note.tag.trim() === filterTag;
    
    return matchesSearch && matchesTag;
  });

  // --- FUNÇÕES DE ARMAZENAMENTO ---
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
      <Text style={styles.toolBtnText}>{label}</Text>
    </TouchableOpacity>
  );

  // --- RENDERIZAÇÃO ---

  if (view === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Minhas de Notas</Text>
          
          {/* CAMPO DE BUSCA */}
          <TextInput 
            style={styles.searchBar}
            placeholder="🔍 Pesquisar título..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* LISTA HORIZONTAL DE TAGS (FILTROS) */}
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
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => setFilterTag(tagName)}
                >
                  <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                    {tagName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* LISTA DE NOTAS (USANDO A LISTA FILTRADA) */}
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <Text style={{color: '#666', textAlign: 'center', marginTop: 50}}>
              {notes.length === 0 ? "Nenhuma nota criada." : "Nenhuma nota encontrada."}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.noteCard} onPress={() => openNote(item)}>
              <View>
                <Text style={styles.noteCardTitle} numberOfLines={1}>
                    {item.title || 'Nota'}
                </Text>
                <Text style={styles.noteCardPreview} numberOfLines={3} ellipsizeMode="tail">
                    {item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : ''}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                {item.tag ? (
                  <View style={[styles.tagBadge, {marginBottom: 0, paddingVertical: 2, paddingHorizontal: 6}]}>
                    <Text style={[styles.tagText, {fontSize: 9}]}>{item.tag}</Text>
                  </View>
                ) : <View />}
                <Text style={styles.noteDate}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity style={styles.fab} onPress={createNewNote}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // TELA DE EDITOR (NÃO MUDOU)
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={saveAndClose} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{'< Voltar'}</Text>
          </TouchableOpacity>

          <View style={styles.headerButtons}>
            {currentId && (
              <TouchableOpacity style={styles.clearBtn} onPress={deleteNote}>
                <Text style={styles.clearBtnText}>Excluir</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={{ backgroundColor: isEditingMode ? '#66bb6a' : '#2196f3', padding: 8, borderRadius: 6 }}
              onPress={() => setIsEditingMode(!isEditingMode)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isEditingMode ? 'Concluir' : 'Editar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {isEditingMode ? (
            <>
              <View style={styles.editorPane}>
                <View style={styles.inputsContainer}>
                  <TextInput style={styles.inputTitle} placeholder="Título..." placeholderTextColor="#888" value={title} onChangeText={setTitle} />
                  <TextInput style={styles.inputTag} placeholder="Tag" placeholderTextColor="#888" value={tag} onChangeText={setTag} />
                </View>
                <TextInput
                  style={styles.textArea} multiline placeholder="Digite aqui..." placeholderTextColor="#666"
                  value={content} onChangeText={setContent}
                  onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                  autoFocus
                />
              </View>
              <View style={{ height: 60 }}>
                <ScrollView horizontal style={styles.toolbar} contentContainerStyle={styles.toolbarContent} keyboardShouldPersistTaps="always">
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
              {title !== '' && <Text style={styles.previewTitle}>{title}</Text>}
              {tag !== '' && <View style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>}
              <Markdown style={markdownStyles}>{content || '*Nota vazia*'}</Markdown>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}