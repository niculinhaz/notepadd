import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/StyledText';
import { useThemeStyles } from '../../constants/theme';
import { useThemeContext } from '../../app/_layout';
import { Link } from 'expo-router';
import { Note } from '../../types';

interface Props {
  item: Note;
}

export const NoteCard = ({ item }: Props) => {
  const { isDarkMode } = useThemeContext();
  const styles = useThemeStyles(isDarkMode);
  
  const cleanContent = item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : '';

  return (
    <Link href={`/(notes)/${item.id}`} asChild>
      <TouchableOpacity style={styles.noteCard}>
        
        <Text style={styles.noteCardPreview} numberOfLines={6} ellipsizeMode="tail">
          {cleanContent || 'Sem conteúdo...'}
        </Text>

        <View style={styles.cardFooterContainer}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.noteCardTitle} numberOfLines={1}>
              {item.title || 'Sem título'}
            </Text>
            {item.tag ? (
              <View style={styles.miniTagBadge}>
                <Text style={styles.miniTagText}>{item.tag}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.noteDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};