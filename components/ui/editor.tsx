import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import Markdown from "react-native-markdown-display";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { styles, markdownStyles } from "../../constants/theme";

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
  const [selection, setSelection] = useState({ start: 0, end: 0 });

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

  const handleFormat = (prefix: string, suffix: string) => {
    const { start, end } = selection;
    setContent(
      content.substring(0, start) +
        prefix +
        content.substring(start, end) +
        suffix +
        content.substring(end)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      <View
        style={{
          paddingTop: 32,
          paddingLeft: 8,
          paddingRight: 20,
          paddingBottom: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#222",
          backgroundColor: "#050505",
          zIndex: 50,
        }}
      >
        <TouchableOpacity onPress={handleExit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="chevron-left" size={25} color="#fff" />
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                marginLeft: 4,
                lineHeight: 22,
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
                color: "rgba(99, 175, 226, 1)",
              }}
            >
              OK
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="trash-2" size={22} color="#cf6679" />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 5 : 0}
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
              />
            </View>

            {/* TOOLBAR */}
            <View style={[styles.toolbar, { marginTop: 16 }]}>
              <ScrollView
                horizontal
                contentContainerStyle={styles.toolbarContent}
                keyboardShouldPersistTaps="always"
                showsHorizontalScrollIndicator={false}
              >
                {["**", "*", "# ", "## ", "\n- ", "`"].map((sym, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.toolBtn}
                    onPress={() => {
                      performHaptic();
                      handleFormat(
                        sym,
                        sym.trim() === "**" || sym.trim() === "*" || sym.trim() === "`" ? sym : ""
                      );
                    }}
                  >
                    <Text style={styles.toolBtnText}>{["B", "I", "H1", "H2", "List", "Code"][i]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.previewPane} contentContainerStyle={{ paddingBottom: 40 }}>
              <TouchableOpacity activeOpacity={1} onPress={toggleToEdit}>
                <Text style={styles.previewTitle}>{title}</Text>

                {tag ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ) : null}

                <Markdown style={markdownStyles}>{content}</Markdown>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
