import { Text, TextInput } from '@/components/ui/StyledText';
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { markdownToHtml } from '@/utils/htmlconverter';
import { htmlToMarkdown } from '@/utils/markdownconverter';
import { useThemeContext } from "../../app/_layout";
import FontFamilyStylesheet from "../../constants/stylesheet";
import { markdownStylesGen, useThemeStyles } from "../../constants/theme";

const converter = require('@vimeiro-co/react-native-html-to-markdown');
converter.use(function (html: string) {
  return html.replace(/<br\s*\/?>/gi, '\n');
});

interface Props {
  title: string;
  setTitle: (t: string) => void;
  tag: string;
  setTag: (t: string) => void;
  content: string;
  setContent: (c: string) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  onSave: (newContent: string) => void;
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
  const hasLoadedRef = useRef(false); 

  const { isDarkMode } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);
  const markdownStyles = markdownStylesGen(isDarkMode);

  const [htmlContent, setHtmlContent] = useState("");

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

  const performHaptic = () => {
    Haptics.selectionAsync();
  };

  const save = async () => {
    performHaptic();
    const finalMarkdown = htmlToMarkdown(htmlContent);
    onSave(finalMarkdown);
  };


  useEffect(() => {
    if (!isEditing) return;


    if (!hasLoadedRef.current) {
      const initialHtml = markdownToHtml(content);
      setHtmlContent(initialHtml);
      hasLoadedRef.current = true;

      requestAnimationFrame(() => {
        editorRef.current?.setContentHTML(initialHtml);
      });
      return;
    }


    requestAnimationFrame(() => {
      editorRef.current?.setContentHTML(htmlContent);
    });

  }, [isEditing]);


  const placeholderText = content.trim() !== '' ? '' : "Digite aqui...";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* HEADER */}
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
        <TouchableOpacity onPress={onExit}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="chevron-left" size={25} color={colors.icon} />
            <Text style={{ fontSize: 20, color: colors.text, marginLeft: 4 }}>
              Voltar
            </Text>
          </View>
        </TouchableOpacity>

        {isEditing ? (
          <TouchableOpacity onPress={save}>
            <Text style={{ fontSize: 18, color: colors.okBtn }}>
              OK
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDelete}>
            <Feather name="trash-2" size={22} color={colors.deleteBtn} />
          </TouchableOpacity>
        )}
      </View>

      {/* EDITOR OU VISUALIZAÇÃO */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >

        {isEditing ? (
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
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
                  style={styles.inputTitle}
                  placeholder="#tag"
                  placeholderTextColor={colors.placeholder}
                  value={tag}
                  onChangeText={setTag}
                />
              </View>

              <RichEditor
                ref={editorRef}
                editorStyle={dynamicEditorStyle}
                useContainer={false}
                placeholder={placeholderText}
                initialContentHTML={htmlContent}  
                onChange={setHtmlContent}
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
                actions.removeFormat,
                actions.undo,
                actions.redo,
              ]}
              style={{ backgroundColor: colors.bg }}
            />

          </ScrollView>

        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.previewPane} contentContainerStyle={{ paddingBottom: 40 }}>
              <TouchableOpacity activeOpacity={1} onPress={() => setIsEditing(true)}>
                <Text style={styles.previewTitle}>{title}</Text>

                {tag ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ) : null}

                {!content.trim() ? (
                  <Text style={{ color: colors.placeholder, fontSize: 18, marginTop: 10 }}>
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
