import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { styles, markdownStyles } from '../../constants/theme';

interface Props {
  title: string; setTitle: (t: string) => void;
  tag: string; setTag: (t: string) => void;
  content: string; setContent: (c: string) => void;
  isEditing: boolean; setIsEditing: (b: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const Editor = ({ 
  title, setTitle, tag, setTag, content, setContent, 
  isEditing, setIsEditing, onSave, onDelete 
}: Props) => {
  
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleFormat = (prefix: string, suffix: string) => {
    const { start, end } = selection;
    setContent(content.substring(0, start) + prefix + content.substring(start, end) + suffix + content.substring(end));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#050505' }}>
      
      {/* HEADER (Fica fixo no topo) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onSave} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerButtons}>
           <TouchableOpacity onPress={onDelete}>
             <Text style={{color:'#cf6679', marginRight:15}}>Excluir</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
             <Text style={{color: '#fff', fontWeight:'bold'}}>{isEditing ? 'OK' : 'Editar'}</Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* ÁREA QUE REAGE AO TECLADO */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
        // Esse offset ajuda a barra não ficar "colada" demais ou escondida atrás de sugestões
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
      >
        {isEditing ? (
          <>
            {/* Campos de Texto (Scrollável) */}
            <ScrollView style={styles.editorPane} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.inputsContainer}>
                <TextInput 
                  style={styles.inputTitle} 
                  placeholder="Título" 
                  placeholderTextColor="#555" 
                  value={title} 
                  onChangeText={setTitle} 
                />
                <TextInput 
                  style={styles.inputTag} 
                  placeholder="#tag" 
                  placeholderTextColor="#555" 
                  value={tag} 
                  onChangeText={setTag} 
                />
              </View>
              <TextInput 
                style={styles.textArea} 
                multiline 
                placeholder="Digite aqui..." 
                placeholderTextColor="#444" 
                value={content} 
                onChangeText={setContent} 
                onSelectionChange={(e) => setSelection(e.nativeEvent.selection)} 
                autoFocus 
                // Importante para o texto rolar quando chegar no fim
                scrollEnabled={false} 
              />
            </ScrollView>
            
            {/* TOOLBAR AZUL (Fica presa na parte de baixo do KeyboardAvoidingView) */}
            <View style={styles.toolbar}>
               <ScrollView horizontal contentContainerStyle={styles.toolbarContent} keyboardShouldPersistTaps="always">
                  {['**', '*', '# ', '## ', '\n- ', '`'].map((sym, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.toolBtn} 
                      onPress={() => handleFormat(sym, sym.trim() === '**' || sym.trim() === '*' || sym.trim() === '`' ? sym : '')}
                    >
                      <Text style={styles.toolBtnText}>{['B', 'I', 'H1', 'H2', 'List', 'Code'][i]}</Text>
                    </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>
          </>
        ) : (
          // Modo Leitura
          <ScrollView style={styles.previewPane}>
            <Text style={styles.previewTitle}>{title}</Text>
            {tag ? <View style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View> : null}
            <Markdown style={markdownStyles}>{content}</Markdown>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};