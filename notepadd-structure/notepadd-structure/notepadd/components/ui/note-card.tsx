import React from 'react';
import { Link } from 'expo-router';
import { Card, Text, View, XStack, YStack } from 'tamagui';

export interface Note {
  id: string;
  title: string;
  tag: string;
  content: string;
  date: string;
}

interface Props {
  item: Note;
}

export const NoteCard = ({ item }: Props) => {
  const cleanContent = item.content ? item.content.replace(/[#*`\[\]-]/g, '').trim() : '';

  return (
    <Link href={`/(notes)/${item.id}`} asChild>
      {/* O Card substitui o TouchableOpacity com estilo */}
      <Card
        bordered
        borderWidth={1}
        borderColor="$borderColor" // Cor automática do tema
        backgroundColor="$background"
        padding="$3"
        borderRadius="$4"
        width="48%"
        minHeight={180}
        pressStyle={{ scale: 0.97 }} // Efeito visual ao clicar
        animation="bouncy"
        marginBottom="$3"
      >
        <Card.Header padding={0}>
          {/* Preview do texto */}
          <Text
            color="$color" 
            opacity={0.6} 
            fontSize="$2" 
            numberOfLines={6}
            lineHeight={18}
          >
            {cleanContent || 'Sem conteúdo...'}
          </Text>
        </Card.Header>

        {/* Rodapé empurrado para baixo */}
        <Card.Footer padding={0} marginTop="auto">
          <YStack width="100%">
            
            {/* Linha Título + Tag */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
              <Text 
                color="$color" 
                fontWeight="bold" 
                fontSize="$4" 
                numberOfLines={1} 
                flex={1}
              >
                {item.title || 'Sem título'}
              </Text>

              {item.tag ? (
                <View 
                  backgroundColor="rgba(97, 218, 251, 0.15)" 
                  paddingHorizontal="$2" 
                  paddingVertical="$1" 
                  borderRadius="$2"
                  marginLeft="$2"
                >
                  <Text color="#61dafb" fontSize={10} fontWeight="bold" textTransform="uppercase">
                    {item.tag}
                  </Text>
                </View>
              ) : null}
            </XStack>

            {/* Data */}
            <Text color="$color" opacity={0.5} fontSize={10}>
              {item.date}
            </Text>

          </YStack>
        </Card.Footer>
      </Card>
    </Link>
  );
};