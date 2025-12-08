import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { marked } from 'marked';
import Markdown from "react-native-markdown-display";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { autoPlacement } from "@floating-ui/core";
import { useThemeContext } from "../../app/_layout";
import { markdownStylesGen, useThemeStyles } from "../../constants/theme";

const converter = require('@vimeiro-co/react-native-html-to-markdown');
converter.use(function (html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
})

interface Props {
  title: string;
  setTitle: (t: string) => void;
  tag: string;
  setTag: (t: string) => void;
  content: string;
  setContent: (c: string) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
  onExit: () => void;
}

export const Editor = ({
  title,
  setTitle,
  tag,
  setTag,
  content,
  setContent,
  isEditing,
  setIsEditing,
  onSave,
  onDelete,
  onExit
}: Props) => {
  const editorRef = useRef<RichEditor>(null);
  
  const { isDarkMode } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);
  const markdownStyles = markdownStylesGen(isDarkMode);

  const [keyboardAvoidingViewKey, setKeyboardAvoidingViewKey] = useState('keyboardAvoidingView');
  
  const colors = {
    bg: isDarkMode ? "#050505" : "#f8f9fa",
    editorBox: isDarkMode ? "#1a1a1a" : "#ffffffff",
    text: isDarkMode ? "#fff" : "#000",
    border: isDarkMode ? "#222" : "#e0e0e0",
    icon: isDarkMode ? "#fff" : "#000",
    placeholder: isDarkMode ? "#555" : "#999",
    okBtn: isDarkMode ? "rgba(99, 175, 226, 1)" : "#007acc",
    deleteBtn: "#cf6679"
  };

  const dynamicEditorStyle = {
    backgroundColor: colors.editorBox,
    color: colors.text,
    placeholderColor: colors.placeholder,
    contentCSSText: `
      body { 
        color: ${colors.text}; 
        background-color: ${colors.bg}; 
        font-family: -apple-system, system-ui, sans-serif;
        padding: 0 10px;
      }
      * { color: ${colors.text}; }
    `,
  };


  const keyboardHideListenerCallback = useCallback(() => {
    setKeyboardAvoidingViewKey(
      'keyboardAvoidingViewKey' + new Date().getTime(),
    );
  }, []);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      keyboardHideListenerCallback,
    );

    return () => {
      keyboardHideListener.remove();
    };
  }, [keyboardHideListenerCallback]);

  const performHaptic = () => {
    Haptics.selectionAsync();
  };

  const save = () => {
    performHaptic();
    onSave();
    setIsEditing(false);
  };

  const handleExit = () => {
    performHaptic();
    setIsEditing(false);
    onExit();
  };

  const toggleToEdit = () => {
    performHaptic();
    setIsEditing(true);
  };

  const handleChange = (html: string) => {
    try {
      setContent(converter.convert(html));
    } catch (e) {
      console.error(e);
    }
  };

  const parseHtml = (markdown: string) => {
    try {
      marked.setOptions({async: false});
      return marked.parse(markdown) as string;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: 20,
          paddingLeft: 8,
          paddingRight: 20,
          paddingBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.bg,
          zIndex: 50,
        }}
      >
        <TouchableOpacity onPress={handleExit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="chevron-left" size={25} color={colors.icon} />
            <Text
              style={{
                fontSize: 20,
                color: colors.text,
                marginLeft: 4,
                lineHeight: 22,
                fontWeight: undefined,
              }}
            >
              Voltar
            </Text>
          </View>
        </TouchableOpacity>

        {isEditing ? (
          <TouchableOpacity onPress={save} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.okBtn,
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="trash-2" size={22} color={colors.deleteBtn} />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? autoPlacement : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? autoPlacement : 0}
        key={keyboardAvoidingViewKey}
      >
        {isEditing ? (
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 30,
            }}
          >
            <View style={styles.editorPane}>
              <View style={styles.inputsContainer}>
                <TextInput
                  style={styles.inputTitle}
                  placeholder="Título"
                  placeholderTextColor={colors.placeholder}
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={styles.inputTag}
                  placeholder="#tag"
                  placeholderTextColor={colors.placeholder}
                  value={tag}
                  onChangeText={setTag}
                />
              </View>
              <RichEditor
                  ref={editorRef}
                  initialContentHTML={parseHtml(content)}
                  editorStyle={dynamicEditorStyle}
                  useContainer={false}
                  placeholder="Digite aqui..."
                  onChange={handleChange}
                />
                </View>
                <RichToolbar
                  editor={editorRef}  
                  selectedButtonStyle={styles.toolBtn}
                  unselectedButtonStyle={styles.unselectedToolBtn}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setStrikethrough,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.removeFormat,
                    actions.undo,
                    actions.redo,
                  ]}
                  style={{
                    backgroundColor: colors.bg
                  }}
                />
              </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.previewPane} contentContainerStyle={{ paddingBottom: 40 }}>
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={toggleToEdit} 
                style={{ minHeight: 200 }}
              >
                <Text style={styles.previewTitle}>{title}</Text>

                {tag ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ) : null}

                {(!content || content.trim() === '') ? (
                  <Text style={{ 
                      color: colors.placeholder, 
                      fontSize: 18, 
                      marginTop: 10,
                  }}>
                    Pressione para começar a digitar...
                  </Text>
                ) : (
                   <Markdown style={markdownStyles}>{content}</Markdown>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};