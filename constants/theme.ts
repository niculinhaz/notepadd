import { Dimensions, StyleSheet, useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const darkColors = {
  bg: '#050505',
  cardBg: '#1e1e1e',
  cardBorder: '#333',
  text: '#fff',
  textSec: '#ccc',
  textMuted: '#666',
  searchBg: '#1e1e1e',
  drawerBg: '#161616',
  divider: '#222',
  tint: '#61dafb',
  inputBg: '#0a0a0a',
  modalBg: '#1e1e1e',
  modalBorder: '#333',
  cancelBtn: '#333',
  deleteBtn: '#cf6679',
};

const lightColors = {
  bg: '#f8f9fa',
  cardBg: '#ffffff',
  cardBorder: '#e0e0e0',
  text: '#1a1a1a',
  textSec: '#4a4a4a',
  textMuted: '#888',
  searchBg: '#e9ecef',
  drawerBg: '#ffffff',
  divider: '#eee',
  tint: '#007acc', 
  inputBg: '#f1f3f5',
  modalBg: '#ffffff',
  modalBorder: '#e0e0e0',
  cancelBtn: '#f0f0f0',
  deleteBtn: '#cf6679',
};

const createStyles = (isDark: boolean) => {
  const c = isDark ? darkColors : lightColors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
      fontFamily: 'SF-Pro',
    },
    
    headerTop: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 20, paddingVertical: 15,
    },
    menuBtn: { padding: 5 },
    appLogo: { fontSize: 22, fontWeight: 'bold', color: c.text, letterSpacing: 1 },
    
    searchSection: { paddingHorizontal: 20, marginBottom: 15 },
    searchBarContainer: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: c.searchBg,
      borderRadius: 12, paddingHorizontal: 15, height: 50,
    },
    searchInput: { 
      flex: 1, 
      color: c.text, 
      fontSize: 16, 
      marginLeft: 10, 
      fontFamily: 'SF-Pro', },

    modalOverlay: { 
      flex: 1, 
      backgroundColor: 'rgba(0,0,0,0.7)', 
      justifyContent: 'flex-start' 
    },
    drawerContainer: {
      width: width * 0.75, height: '100%', backgroundColor: c.drawerBg,
      padding: 20, borderRightWidth: 1, borderRightColor: c.cardBorder,
    },
    drawerHeader: { 
      fontSize: 24, color: c.text, marginBottom: 30, marginTop: 20, fontFamily: 'SF-Pro-Bold', 
    },
    drawerItem: {
      flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15,
      borderBottomWidth: 1, borderBottomColor: c.divider,
    },
    drawerItemText: { fontSize: 16, color: c.textMuted, fontWeight: '500', fontFamily: 'SF-Pro' },
    drawerItemTextSelected: { color: c.text, fontFamily: 'SF-Pro-Bold', },
    drawerCount: { color: c.textMuted, fontSize: 14, fontFamily: 'SF-Pro' },

    infoRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 25, marginBottom: 10,
    },
    infoText: { color: c.text, fontSize: 14, fontWeight: '600', fontFamily: 'SF-Pro-Bold',},
    sortButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    sortText: { color: c.textMuted, fontSize: 12, fontFamily: 'SF-Pro' },

    notesList: { paddingHorizontal: 20, paddingBottom: 100 },
    columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
    
    noteCard: {
      width: '48%',
      backgroundColor: c.cardBg,
      borderRadius: 16,
      padding: 15,
      borderWidth: 1,
      borderColor: c.cardBorder,
      minHeight: 180,
      flexDirection: 'column',
      fontFamily: 'SF-Pro',
    },

    noteCardPreview: { 
      color: c.textSec, 
      fontSize: 13, 
      lineHeight: 18, 
      flex: 1, 
      marginBottom: 12, 
      fontFamily: 'SF-Pro',
    },
    
    cardFooterContainer: { justifyContent: 'flex-end' },
    
    cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, gap: 8 },
    
    noteCardTitle: { 
      color: c.text, 
      fontSize: 15, 
      flex: 1, 
      fontFamily: 'SF-Pro-Bold', 
    },

    miniTagBadge: { backgroundColor: isDark ? 'rgba(97, 218, 251, 0.15)' : 'rgba(0, 122, 204, 0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    miniTagText: { color: c.tint, fontSize: 10, textTransform: 'uppercase', fontFamily: 'SF-Pro-Bold', },
    noteDate: { color: c.textMuted, fontSize: 11, fontFamily: 'SF-Pro', },

    fab: {
      position: 'absolute', bottom: 30, right: 30, backgroundColor: isDark ? '#fff' : '#1e1e1e',
      width: 65, height: 65, borderRadius: 35, justifyContent: 'center',
      alignItems: 'center', elevation: 10,
    },
    fabText: { fontSize: 32, color: isDark ? '#000' : '#fff', fontWeight: '300', marginTop: -4, fontFamily: 'SF-Pro', },

    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      padding: 15, borderBottomWidth: 1, borderBottomColor: c.cardBorder, backgroundColor: c.cardBg,
    },
    backBtn: { padding: 5 },
    backBtnText: { color: c.text, fontSize: 16, fontFamily: 'SF-Pro', },
    headerButtons: { flexDirection: 'row', gap: 10 },

    editorPane: { flex: 1, padding: 20, backgroundColor: c.bg },
    
    inputsContainer: { marginBottom: 20, gap: 15 },
    
    inputTitle: {
      backgroundColor: c.cardBg, color: c.text, padding: 12, borderRadius: 8,
      fontSize: 16, fontWeight: '600', borderWidth: 1, borderColor: c.cardBorder, 
      fontFamily: 'SF-Pro-Bold',
    },
    inputTag: {
      backgroundColor: c.cardBg, color: c.tint, padding: 10, borderRadius: 8,
      fontSize: 14, borderWidth: 1, borderColor: c.cardBorder, fontFamily: 'SF-Pro',
    },
    textArea: { 
      flex: 1, color: c.textSec, fontSize: 16, lineHeight: 24, textAlignVertical: 'top',
      backgroundColor: c.inputBg, borderRadius: 8, padding: 10, fontFamily: 'SF-Pro',
    },

    toolbar: { 
      backgroundColor: c.cardBg, height: 60, borderTopWidth: 1, borderTopColor: c.cardBorder, 
    },
    toolbarContent: { alignItems: 'center', paddingHorizontal: 10, gap: 12 },
    toolBtn: { 
      backgroundColor: c.tint, paddingVertical: 8, paddingHorizontal: 24,
      minWidth: Math.ceil(width / 10), alignItems: 'center', justifyContent: 'center',
    },
    unselectedToolBtn: {
      backgroundColor: c.bg, paddingVertical: 8, paddingHorizontal: 24,
      minWidth: Math.ceil(width / 10), alignItems: 'center', justifyContent: 'center',
    },
    toolBtnText: { color: isDark ? '#000' : '#fff', fontWeight: 'bold', fontSize: 14, fontFamily: 'SF-Pro-Bold', },

    previewPane: { flex: 1, padding: 20, backgroundColor: c.bg },
    previewTitle: { fontSize: 32, color: c.text, marginBottom: 15, fontFamily: 'SF-Pro-Bold', },
    tagBadge: {
      backgroundColor: c.tint, alignSelf: 'flex-start', paddingVertical: 8,
      paddingHorizontal: 15, borderRadius: 20, marginBottom: 25,
    },
    tagText: { color: isDark ? '#000' : '#fff', fontSize: 14, textTransform: 'uppercase', fontFamily: 'SF-Pro-Bold', },

    modalCenterOverlay: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20
    },
    modalBox: {
      width: width * 0.85, backgroundColor: c.modalBg, borderRadius: 12, padding: 24,
      borderWidth: 1, borderColor: c.modalBorder,
      shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: c.text, marginBottom: 10, fontFamily: 'SF-Pro' },
    modalText: { fontSize: 16, color: c.textSec, marginBottom: 24, lineHeight: 22, fontFamily: 'SF-Pro' },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    btnCancel: {
      justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: c.cancelBtn,
    },
    btnDelete: {
      justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: c.deleteBtn,
    },
    btnTextCancel: { color: c.text, fontWeight: 'regular', fontFamily: 'SF-Pro' },
    btnTextDelete: { color: '#fff', fontWeight: 'bold', fontFamily: 'SF-Pro' }
  });
};

export const styles = createStyles(true);

export const useThemeStyles = (isDark: boolean) => {
  return createStyles(isDark);
};

export const markdownStylesGen = (isDark: boolean) => ({
  body: { color: isDark ? '#e0e0e0' : '#333', fontSize: 18, lineHeight: 28, fontFamily: 'SF-Pro', },
  paragraph: {
    color: isDark ? '#e0e0e0' : '#333', 
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'SF-Pro',
    marginVertical: 8, 
  },
  text: {
    fontFamily: 'SF-Pro',
  },
  heading1: { color: isDark ? '#fff' : '#000', fontSize: 24, marginVertical: 10, fontFamily: 'SF-Pro-Bold', },
  heading2: { color: isDark ? '#fff' : '#000', fontSize: 20, marginVertical: 8, fontFamily: 'SF-Pro-Bold', },
  strong: { color: isDark ? '#fff' : '#000', fontFamily: 'SF-Pro-Bold', },
  list_item: { marginVertical: 4 },
  code_inline: { backgroundColor: isDark ? '#333' : '#e9ecef', color: isDark ? '#ffcc00' : '#d63384', padding: 4, borderRadius: 4, fontFamily: 'SF-Pro', },
});

export const cardMarkdownStyles  = (isDark: boolean) => ({
  body: { color: isDark ? '#e0e0e0' : '#333', fontSize: 12, lineHeight: 28, fontFamily: 'SF-Pro', },
  heading1: { color: isDark ? '#fff' : '#000', fontSize: 16, fontWeight: '700', marginVertical: 10, fontFamily: 'SF-Pro', },
  heading2: { color: isDark ? '#fff' : '#000', fontSize: 14, fontWeight: '700', marginVertical: 8, fontFamily: 'SF-Pro', },
  strong: { color: isDark ? '#fff' : '#000', fontWeight: '700', fontFamily: 'SF-Pro', },
  list_item: { marginVertical: 4, fontFamily: 'SF-Pro' },
  code_inline: { backgroundColor: isDark ? '#333' : '#e9ecef', color: isDark ? '#ffcc00' : '#d63384', padding: 4, borderRadius: 4, fontFamily: 'SF-Pro', },
});

const isDark = useColorScheme() === 'dark';

export const editorStyle = {
    backgroundColor: isDark ? darkColors.cardBg : lightColors.cardBg,
    caretColor: isDark ? darkColors.tint : lightColors.tint,
    color: isDark ? darkColors.text : lightColors.text,
    cssText: `
      border-radius: 12px;
      border: 1px solid #333;
    `
}

export const markdownStyles = markdownStylesGen(true);