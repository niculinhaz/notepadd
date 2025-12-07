import React, { useRef, useState } from 'react';
import { SafeAreaView , SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from 'react-native';
import { RichEditor, RichEditorProps, RichToolbar } from 'react-native-pell-rich-editor';
import { useTheme, View } from 'tamagui';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Editor () {

  const colorScheme = useColorScheme();
  const theme = useTheme();

  const [content, setContent] = useState('');    
  const [inputHeight, setInputHeight] = useState(40);

  const editorRef = useRef<RichEditor>(null);

  const styles = StyleSheet.create(
  {
    textEditor: {
      flex: 1
    },
    selectedButton: {
      borderColor: '#2273f5',
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: 'solid'
    },
    toolbar: {
      backgroundColor: colorScheme === 'dark' ? 'white' : 'black'
    },
    selectedIcon: {
      color: colorScheme === 'dark' ? 'white' : 'black'
    },
    unselectedIcon: {
      color: colorScheme === 'dark' ? 'white' : 'black'
    },
    editorWrapper: {
      borderWidth: 2,
      minHeight: 100,
      height: 570,
      minWidth: screenWidth,
    }
  })

  return (
        <SafeAreaProvider>
            <SafeAreaView>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.textEditor}
              >
                <View
                  style={styles.editorWrapper}
                >
                  <RichEditor
                    ref={editorRef}
                    initialContentHTML=''
                    editorStyle={{
                      backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
                      caretColor: colorScheme === 'dark' ? 'white' : 'black',
                      color: colorScheme === 'dark' ? 'white' : 'black',
                    }}
                    useContainer={false}
                  />
                </View>
                <RichToolbar
                  editor={editorRef}  
                  selectedButtonStyle={styles.selectedButton}
                />
              </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
  );
};