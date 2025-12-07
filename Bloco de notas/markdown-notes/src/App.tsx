import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';

// IMPORTAMOS OS ESTILOS AQUI
import { styles, markdownStyles } from './styles';

interface NoteData {
  title: string;
  tag: string;
  content: string;
}

const STORAGE_KEY = '@my_notes_ts';

export default function App() {
  const [title, setTitle] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [content, setContent] = useState<string>('# Olá Mobile com TS!\n\nEscreva aqui...');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [title, tag, content]);

  const saveData = async () => {
    try {
      const data: NoteData = { title, tag, content };
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar', e);
    }
  };

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue) as NoteData;
        setTitle(data.title || '');
        setTag(data.tag || '');
        setContent(data.content || '');
      }
    } catch (e) {
      console.error('Erro ao carregar', e);
    }
  };

  const clearAll = () => {
    Alert.alert(
      "Limpar tudo",
      "Tem certeza que deseja apagar sua nota?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: () => {
            setTitle('');
            setTag('');
            setContent('');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* --- CABEÇALHO --- */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>📝 Notas TS</Text>
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Título..."
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.inputTag}
            placeholder="Tag (ex: #ideia)"
            placeholderTextColor="#888"
            value={tag}
            onChangeText={setTag}
          />
        </View>

        {/* --- ÁREA DIVIDIDA --- */}
        <View style={styles.contentContainer}>
          
          {/* Editor */}
          <View style={styles.editorPane}>
            <Text style={styles.sectionLabel}>EDITOR</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Digite seu Markdown..."
              placeholderTextColor="#666"
              value={content}
              onChangeText={setContent}
            />
          </View>

          {/* Preview */}
          <View style={styles.previewPane}>
            <Text style={styles.sectionLabel}>VISUALIZAÇÃO</Text>
            <ScrollView style={styles.scrollView}>
              {title !== '' && <Text style={styles.previewTitle}>{title}</Text>}
              
              {tag !== '' && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )}
              
              <Markdown style={markdownStyles}>
                {content}
              </Markdown>
            </ScrollView>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}