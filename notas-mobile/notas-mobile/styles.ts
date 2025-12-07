import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  
  // --- TELA DE LISTA (HOME) ---
  homeHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#1e1e1e',
    gap: 15, // Espaço entre Título, Busca e Filtros
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // Barra de Pesquisa
  searchBar: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },

  // Área de Filtros (Tags)
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    borderWidth: 1,
    borderColor: '#444',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#61dafb', // Azul quando selecionado
    borderColor: '#61dafb',
  },
  filterText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#000', // Texto preto no fundo azul
    fontWeight: 'bold',
  },

  // Lista de Notas
  notesList: {
    padding: 10,
    gap: 10,
  },
  columnWrapper: {
    gap: 10,
  },
  noteCard: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    flex: 1,
    minHeight: 110,
    justifyContent: 'space-between'
  },
  noteCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteCardPreview: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  noteDate: {
    color: '#555',
    fontSize: 10,
  },

  // Botão Flutuante (+)
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#61dafb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 30,
    color: '#000',
    marginTop: -2,
  },

  // --- TELA DE EDITOR ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  backBtn: {
    padding: 10,
  },
  backBtnText: {
    color: '#61dafb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  clearBtn: {
    backgroundColor: '#cf6679',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
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
    backgroundColor: '#181818',
  },
  previewPane: {
    flex: 1,
    padding: 15,
    backgroundColor: '#121212',
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 15,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // --- BARRA DE FERRAMENTAS ---
  toolbar: {
    backgroundColor: '#333',
    borderTopWidth: 1,
    borderTopColor: '#555',
    height: 60,
  },
  toolbarContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 12,
  },
  toolBtn: {
    backgroundColor: '#61dafb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const markdownStyles = {
  body: { color: '#e0e0e0', fontSize: 16, lineHeight: 24 },
  heading1: { color: '#fff', marginTop: 10, marginBottom: 10, fontSize: 22, fontWeight: 'bold' },
  heading2: { color: '#fff', borderBottomWidth: 1, borderColor: '#444', marginTop: 10, fontSize: 20, fontWeight: 'bold' },
  heading3: { color: '#ccc', marginTop: 10, fontSize: 18, fontWeight: 'bold' },
  strong: { color: '#61dafb', fontWeight: 'bold' },
  em: { fontStyle: 'italic', color: '#888' },
  list_item: { marginVertical: 5 },
  bullet_list_icon: { color: '#fff', marginLeft: 10 },
  code_inline: { backgroundColor: '#333', color: '#ffcc00', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 },
  fence: { backgroundColor: '#1e1e1e', color: '#d4d4d4', borderColor: '#444', borderWidth: 1, padding: 10, marginTop: 10, borderRadius: 6 },
};