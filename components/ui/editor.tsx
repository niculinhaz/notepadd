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
import Markdown from "react-native-markdown-display";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

import { autoPlacement } from "@floating-ui/core";
import { useThemeContext } from "../../app/_layout";
import { editorStyle, markdownStylesGen, useThemeStyles } from "../../constants/theme";

const converter = require('@vimeiro-co/react-native-html-to-markdown');

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
}: Props) => {
  const editorRef = useRef<RichEditor>(null);
  
  const { isDarkMode } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);
  const markdownStyles = markdownStylesGen(isDarkMode);

  const [keyboardAvoidingViewKey, setKeyboardAvoidingViewKey] = useState('keyboardAvoidingView');
  
  const colors = {
    bg: isDarkMode ? "#050505" : "#f8f9fa",
    text: isDarkMode ? "#fff" : "#000",
    border: isDarkMode ? "#222" : "#e0e0e0",
    icon: isDarkMode ? "#fff" : "#000",
    placeholder: isDarkMode ? "#555" : "#999",
    okBtn: isDarkMode ? "rgba(99, 175, 226, 1)" : "#007acc",
    deleteBtn: "#cf6679"
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
    setIsEditing(false);
  };

  const handleExit = () => {
    performHaptic();
    onSave();
    setIsEditing(false);
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
                fontWeight: "",
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
                  initialContentHTML={content}
                  editorStyle={editorStyle}
                  useContainer={false}
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
                    actions.setUnderline,
                    actions.setStrikethrough,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.checkboxList,
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

// import React, { useRef, useState } from 'react';
// import { SafeAreaView , SafeAreaProvider } from 'react-native-safe-area-context';
// import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from 'react-native';
// import { RichEditor, RichEditorProps, RichToolbar } from 'react-native-pell-rich-editor';
// import { useTheme, View } from 'tamagui';

// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;

// export default function Editor () {

//   const colorScheme = useColorScheme();
//   const theme = useTheme();

//   const [content, setContent] = useState('');    
//   const [inputHeight, setInputHeight] = useState(40);

//   const editorRef = useRef<RichEditor>(null);

//   const styles = StyleSheet.create(
//   {
//     textEditor: {
//       flex: 1
//     },
//     selectedButton: {
//       borderColor: '#2273f5',
//       borderRadius: 12,
//       borderWidth: 2,
//       borderStyle: 'solid'
//     },
//     toolbar: {
//       backgroundColor: colorScheme === 'dark' ? 'white' : 'black'
//     },
//     selectedIcon: {
//       color: colorScheme === 'dark' ? 'white' : 'black'
//     },
//     unselectedIcon: {
//       color: colorScheme === 'dark' ? 'white' : 'black'
//     },
//     editorWrapper: {
//       borderWidth: 2,
//       minHeight: 100,
//       height: 570,
//       minWidth: screenWidth,
//     }
//   })

//   return (
//         <SafeAreaProvider>
//             <SafeAreaView>
//               <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textEditor}
//               >
//                 <View
//                   style={styles.editorWrapper}
//                 >
//                   <RichEditor
//                     ref={editorRef}
//                     initialContentHTML=''
//                     editorStyle={{
//                       backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
//                       caretColor: colorScheme === 'dark' ? 'white' : 'black',
//                       color: colorScheme === 'dark' ? 'white' : 'black',
//                     }}
//                     useContainer={false}
//                   />
//                 </View>
//                 <RichToolbar
//                   editor={editorRef}  
//                   selectedButtonStyle={styles.selectedButton}
//                 />
//               </KeyboardAvoidingView>
//             </SafeAreaView>
//         </SafeAreaProvider>
//   );
// };