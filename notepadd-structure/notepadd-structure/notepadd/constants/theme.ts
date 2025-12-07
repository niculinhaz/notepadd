import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  
  // --- CABEÇALHO ---
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  menuBtn: { padding: 5 },
  appLogo: { fontSize: 22, fontWeight: 'bold', color: '#fff', letterSpacing: 1 },

  // --- BUSCA ---
  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBarContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e',
    borderRadius: 12, paddingHorizontal: 15, height: 50,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, marginLeft: 10 },
  // filtroBtn removido

  // --- GAVETA / MENU LATERAL (ESTILOS QUE FALTAVAM) ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'flex-start' 
  },
  drawerContainer: {
    width: width * 0.75, height: '100%', backgroundColor: '#161616',
    padding: 20, borderRightWidth: 1, borderRightColor: '#333',
  },
  drawerHeader: { 
    fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 30, marginTop: 20 
  },
  drawerItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#222',
  },
  drawerItemText: { fontSize: 16, color: '#888', fontWeight: '500' },
  drawerItemTextSelected: { color: '#fff', fontWeight: 'bold' },
  drawerCount: { color: '#444', fontSize: 14 },

  // --- INFO ROW ---
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, marginBottom: 10,
  },
  infoText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortText: { color: '#666', fontSize: 12 },

  // --- LISTA ---
  notesList: { paddingHorizontal: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  
  // CARD DA NOTA (Estilo Samsung que fizemos antes)
  noteCard: {
    width: '48%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 180,
    flexDirection: 'column',
  },
  noteCardPreview: { 
    color: '#ccc', fontSize: 13, lineHeight: 18, flex: 1, marginBottom: 12, 
  },
  cardFooterContainer: { justifyContent: 'flex-end' },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 },
  noteCardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  miniTagBadge: { backgroundColor: 'rgba(97, 218, 251, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  miniTagText: { color: '#61dafb', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  noteDate: { color: '#777', fontSize: 11 },

  // --- FAB ---
  fab: {
    position: 'absolute', bottom: 30, right: 30, backgroundColor: '#fff',
    width: 65, height: 65, borderRadius: 35, justifyContent: 'center',
    alignItems: 'center', elevation: 10,
  },
  fabText: { fontSize: 32, color: '#000', fontWeight: '300', marginTop: -4 },

  // --- EDITOR ---
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#1e1e1e',
  },
  backBtn: { padding: 5 },
  backBtnText: { color: '#fff', fontSize: 16 },
  headerButtons: { flexDirection: 'row', gap: 10 },
  
  editorPane: { flex: 1, padding: 20, backgroundColor: '#050505' },
  inputsContainer: { marginBottom: 20, gap: 15 },

  // Estilos de Caixa para o Editor
  inputTitle: {
    backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 8,
    fontSize: 16, fontWeight: '600', borderWidth: 1, borderColor: '#333',
  },
  inputTag: {
    backgroundColor: '#1e1e1e', color: '#61dafb', padding: 10, borderRadius: 8,
    fontSize: 14, borderWidth: 1, borderColor: '#333',
  },
  textArea: { 
    flex: 1, color: '#ccc', fontSize: 16, lineHeight: 24, textAlignVertical: 'top',
    backgroundColor: '#0a0a0a', borderRadius: 8, padding: 10,
  },
  
  toolbar: { 
    backgroundColor: '#1e1e1e', height: 60, borderTopWidth: 1, borderTopColor: '#333', 
  },
  toolbarContent: { alignItems: 'center', paddingHorizontal: 10, gap: 12 },
  toolBtn: { 
    backgroundColor: '#61dafb', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: 6, minWidth: 45, alignItems: 'center', justifyContent: 'center',
  },
  toolBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  
  // --- PREVIEW ---
  previewPane: { flex: 1, padding: 20, backgroundColor: '#050505' },
  previewTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  tagBadge: {
    backgroundColor: '#61dafb', alignSelf: 'flex-start', paddingVertical: 8,
    paddingHorizontal: 15, borderRadius: 20, marginBottom: 25,
  },
  tagText: { color: '#000', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
});

// AQUI ESTÁ A CORREÇÃO DO ERRO 'No overload matches this call'
export const markdownStyles = {
  body: { color: '#e0e0e0', fontSize: 18, lineHeight: 28 },
  heading1: { color: '#fff', fontSize: 24, fontWeight: '700', marginVertical: 10 },
  heading2: { color: '#fff', fontSize: 20, fontWeight: '700', marginVertical: 8 },
  strong: { color: '#fff', fontWeight: '700' },
  list_item: { marginVertical: 4 },
  code_inline: { backgroundColor: '#333', color: '#ffcc00', padding: 4, borderRadius: 4 },
};