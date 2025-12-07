import { useRouter } from 'expo-router';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';

export default function ModalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  function saveNote() {
    // Aqui você faz o salvamento real
    console.log("Nota criada:", { title, text });

    router.back(); // fecha o modal
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nova Nota</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite sua nota..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <Pressable style={styles.button} onPress={saveNote}>
        <Text style={styles.buttonText}>Salvar</Text>
      </Pressable>

      <Pressable style={styles.cancel} onPress={() => router.back()}>
        <Text style={{ color: "#8257e6" }}>Cancelar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
  },
  button: {
    backgroundColor: "#8257e6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancel: {
    marginTop: 20,
    alignItems: "center",
  },
});
