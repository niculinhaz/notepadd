import React from 'react';
import { FlatList } from 'react-native';
import { H1, H3, Heading, Separator, Text, View } from 'tamagui';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import NoteCard from '@/components/ui/note-card';


interface Note {
    id: number;
    text: string;
}

const notes: Note[] = [
    {
        id: 1,
        text: 'aaa'
    },
    {
        id: 2,
        text: 'aaa'
    },
    {
        id: 3,
        text: 'aaa'
    }
];

type ItemProps = {
    title: string;
}

const Item = ({title}: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

const text = `
    Este é um parágrafo com **texto em negrito** e *texto em itálico*.

    - Item da lista 1
    - Item da lista 2

    \`\`\`javascript
    console.log('Hello, Markdown!');
    \`\`\`
`;

export default function Notes() {
    return (
        <>
        <View style={{width: '100%', height: '12%'}}>
            <H3>Notepadd</H3>
        </View>
            <SafeAreaProvider>
                <SafeAreaView>
                    <FlatList
                    data={notes}
                    renderItem={(note) => <NoteCard id='1' title='Nota teste' text={text} createdAt='02/12/2025' ></NoteCard>}
                    keyExtractor={note => `${note.id}`}
                    columnWrapperStyle={{
                        justifyContent: "space-between"
                    }}
                    numColumns={3}                    
                    >
                    </FlatList>
                </SafeAreaView>
            </SafeAreaProvider>

        </>
    );
}