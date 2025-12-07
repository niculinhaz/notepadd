import { Text, View } from '@tamagui/core';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import { H1, Heading } from 'tamagui';
import { SafeAreaView } from "react-native-safe-area-context";

type NoteCardProps = {
    id: string;
    title?: string;
    text?: string;
    createdAt: string;
}

export default function NoteCard({id, title, text, createdAt}: NoteCardProps) {
    return (
        <SafeAreaView style={{flexDirection: 'column', justifyContent: 'space-around', gap: '10px'}}>
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', height: '50%', width: '40%', padding: '40px', borderRadius: 20, border: '2px solid black', overflow: 'hidden'}}>
                <H1>{title}</H1>
                <Markdown>{text}</Markdown>
            </View>
        </SafeAreaView>
    );
}