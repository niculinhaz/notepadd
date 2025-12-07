import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  appTitle: {
    color: '#61dafb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearBtn: {
    backgroundColor: '#cf6679',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearBtnText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputsContainer: {
    padding: 10,
    backgroundColor: '#1e1e1e',
    gap: 10,
  },
  inputTitle: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  inputTag: {
    backgroundColor: '#2d2d2d',
    color: '#61dafb',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  editorPane: {
    flex: 1,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#181818',
  },
  previewPane: {
    flex: 1,
    padding: 15,
    backgroundColor: '#121212',
  },
  sectionLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  textArea: {
    flex: 1,
    color: '#d4d4d4',
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  scrollView: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: '#1565c0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 15,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Estilos específicos para o Markdown (exportamos separado)
export const markdownStyles = {
  body: { color: '#e0e0e0', fontSize: 16, lineHeight: 24 },
  heading1: { color: '#fff', marginTop: 10, marginBottom: 10, fontSize: 22 },
  heading2: { color: '#fff', borderBottomWidth: 1, borderColor: '#444', marginTop: 10, fontSize: 20 },
  strong: { color: '#61dafb', fontWeight: 'bold' },
  link: { color: '#bb86fc' },
  list_item: { marginVertical: 5 },
  bullet_list_icon: { color: '#fff', marginLeft: 10 },
};