import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/StyledText';
import { useThemeStyles } from '../../constants/theme';
import { useThemeContext } from '../../app/_layout';
import { router } from 'expo-router'; 
import { Note } from '@/type'; 
import { Feather } from '@expo/vector-icons';

interface Props {
  item: Note;
  isSelectionMode: boolean;       
  isSelected: boolean;            
  onSelect: (id: string) => void; 
  onLongPress: (id: string) => void;
}

export const NoteCard = ({ item, isSelectionMode, isSelected, onSelect, onLongPress }: Props) => {
  const { isDarkMode } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);
  
  const cleanContent = item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : '';

  const checkboxUnselectedColor = isDarkMode ? '#ccc' : '#888';
  const checkboxSelectedColor = isDarkMode ? '#61dafb' : '#007acc';

  const noTagBg = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const noTagText = isDarkMode ? '#555' : '#999';

  const handlePress = () => {
    if (isSelectionMode) {
      onSelect(item.id);
    } else {
      router.push(`/(notes)/${item.id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.noteCard,
        isSelected && { 
            borderColor: checkboxSelectedColor, 
            borderWidth: 2,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f8ff' 
        } 
      ]}
      onLongPress={() => onLongPress(item.id)}
      onPress={handlePress}
      activeOpacity={0.7}
      delayLongPress={300}
    >
      {isSelectionMode && (
        <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
          <Feather 
            name={isSelected ? "check-circle" : "circle"} 
            size={24} 
            color={isSelected ? checkboxSelectedColor : checkboxUnselectedColor} 
          />
        </View>
      )}

      <Text style={styles.noteCardPreview} numberOfLines={6} ellipsizeMode="tail">
        {cleanContent || 'Sem conteúdo...'}
      </Text>

      <View style={styles.cardFooterContainer}>
        <Text 
          style={[styles.noteCardTitle, { flex: 0, marginBottom: 6, width: '100%' }]} 
          numberOfLines={1}
        >
          {item.title || 'Sem título'}
        </Text>       
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>         
          {item.tag ? (
            <View style={styles.miniTagBadge}>
              <Text style={styles.miniTagText}>{item.tag}</Text>
            </View>
          ) : (
            <View style={[styles.miniTagBadge, { backgroundColor: noTagBg }]}>
              <Text style={[styles.miniTagText, { color: noTagText }]}>SEM TAG</Text>
            </View>
          )}
          <Text style={styles.noteDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};