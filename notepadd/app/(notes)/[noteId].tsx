import Editor from "@/components/ui/editor";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { H3, Input, ScrollView, View } from "tamagui";

export default function NoteId() {
    const [title, setTitle] = useState<string>();
    return (
        <>
            <View style={{width: '100%', height: '12%'}}>
                <Input
                    numberOfLines={1}
                    onChangeText={setTitle}
                    value={title}
                    placeholder="Insira um título aqui..."
                    size="$6"
                />
            </View>
            <SafeAreaProvider>
                <SafeAreaView>
                    <ScrollView>
                        <Editor></Editor>
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </>
    );
};
