import React from 'react';
import Markdown from 'react-native-markdown-display';
import { Button, Card, H6, Text, View } from 'tamagui';
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type NoteCardProps = {
    id: string;
    title?: string;
    text?: string;
    createdAt: string;
}

export default function NoteCard({id, title, text, createdAt}: NoteCardProps) {
    const router = useRouter();

    const handlePress = () => {
        router.push(`/${id}`);
    }

    return (
        <SafeAreaView style={{flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center', gap: '10px'}}>
                <Card size={'$1.5'} width={115} height={140} rounded={"$2"}>
                    <Pressable onPress={handlePress}>
                        <Card.Header padded>
                            <H6>{title}</H6>
                        </Card.Header>
                        <Markdown>{text}</Markdown>
                    </Pressable>
                </Card>
        </SafeAreaView>
    );
}