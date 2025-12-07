import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../../constants/theme';
import { Link } from 'expo-router';
import { Note } from '../../types';

interface Props {
  item: Note;
}

export const NoteCard = ({ item }: Props) => {
  const cleanContent = item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : '';

  return (
    <Link href={`/(notes)/${item.id}`} asChild>
      <TouchableOpacity style={styles.noteCard}>
        
        {/* CONTEÚDO EM CIMA */}
        <Text style={styles.noteCardPreview} numberOfLines={6} ellipsizeMode="tail">
          {cleanContent || 'Sem conteúdo...'}
        </Text>

        {/* RODAPÉ EM BAIXO */}
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