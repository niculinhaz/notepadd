import React, { useMemo, useContext } from "react";
import {
  SectionList,
  TouchableOpacity,
  View as RNView,
  useWindowDimensions,
  Text as RNText,
} from "react-native";
import { View, Text, useTheme } from "@tamagui/core";
import { H1 } from "tamagui";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { AppThemeContext } from "../_layout";

//testeeee
// número de colunas conforme largura da tela

function getColumnsForWidth(width: number) {
  if (width >= 1200) return 5;
  if (width >= 900) return 4;
  if (width >= 600) return 3;
  return 2;
}

function NoteCard({
  note,
  size,
  fontScale = 1,
  onPress,
  theme,
}: {
  note: any;
  size: number;
  fontScale?: number;
  onPress: (n: any) => void;
  theme: any;
}) {
  const titleFont = Math.max(12, Math.round(14 * fontScale));
  const dateFont = Math.max(10, Math.round(12 * fontScale));

  return (
    <TouchableOpacity
      onPress={() => onPress(note)}
      activeOpacity={0.8}
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <RNView
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(8, Math.round(size * 0.08)),
          backgroundColor: theme.card.val,
          marginBottom: 8,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <RNText
          numberOfLines={2}
          style={{
            fontSize: Math.max(10, Math.round(size * 0.12)),
            textAlign: "center",
            paddingHorizontal: 6,
            color: theme.text.val,
          }}
        >
          {note.preview ?? note.title?.slice(0, 40)}
        </RNText>
      </RNView>

      <Text
        numberOfLines={1}
        style={{
          fontWeight: "700",
          textAlign: "center",
          fontSize: titleFont,
          color: theme.text.val,
        }}
      >
        {note.title}
      </Text>

      <Text
        numberOfLines={1}
        style={{
          fontSize: dateFont,
          opacity: 0.6,
          textAlign: "center",
          color: theme.text.val,
        }}
      >
        {note.date}
      </Text>
    </TouchableOpacity>
  );
}


//notas por data e cria linhas responsivas

function buildSections(notes: any[], columns: number) {
  const groups = notes.reduce((acc: Record<string, any[]>, note) => {
    (acc[note.date] = acc[note.date] || []).push(note);
    return acc;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => {
      const rows = [];
      const items = groups[date];
      for (let i = 0; i < items.length; i += columns) {
        rows.push(items.slice(i, i + columns));
      }
      return { title: date, data: rows };
    });
}


export default function Notes() {
  const theme = useTheme();
  const { theme: themeName, toggleTheme } = useContext(AppThemeContext);

  const router = useRouter(); // <-- ADICIONADO

  const { width } = useWindowDimensions();

  const notes = [
    { id: 1, title: "Primeira nota", date: "02/12/2025", preview: "Resumo: reunião..." },
    { id: 2, title: "Ideias", date: "02/12/2025", preview: "Design do app..." },
    { id: 3, title: "Estudos", date: "01/12/2025", preview: "Tópicos: vetores..." },
    { id: 4, title: "Lista de compras", date: "01/12/2025", preview: "Leite, Pão, Café" },
    { id: 5, title: "Rascunho", date: "01/12/2025", preview: "Escrever artigo..." },
    { id: 6, title: "Projeto", date: "30/11/2025", preview: "Planejar sprint..." },
  ];

  const sidePadding = Math.max(16, Math.round(Math.min(28, width * 0.04)));
  const columns = getColumnsForWidth(width);
  const gapBetween = 12;

  const availableWidth = width - sidePadding * 2 - gapBetween * (columns - 1);
  const columnOuterWidth = Math.floor(availableWidth / columns);
  const squareSize = Math.round(columnOuterWidth * 0.92);
  const fontScale = Math.max(0.9, Math.min(1.6, columnOuterWidth / 140));

  const sections = useMemo(() => buildSections(notes, columns), [notes, columns]);

  const openNote = (note: any) => {
    router.push(`/(notes)/${note.id}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: sidePadding,
          backgroundColor: theme.background.val,
        }}
      >
        {/* Topo */}
        <View
          style={{
            paddingTop: 18,
            paddingBottom: 6,
            backgroundColor: theme.header.val,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <H1 color={theme.text.val}>Notepadd</H1>

            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: theme.card.val,
                borderRadius: 8,
              }}
            >
              <RNText style={{ color: theme.text.val, fontWeight: "600" }}>
                {themeName === "dark" ? "☀️ Claro" : "🌙 Escuro"}
              </RNText>
            </TouchableOpacity>
          </View>

          <Text marginTop={10} fontSize={16} color={theme.text.val}>
            Olá, usuário 👋
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 14,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: theme.card.val,
                flex: 1,
                marginRight: 10,
              }}
            >
              <Text color={theme.text.val}>Pesquisar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: theme.card.val,
                width: 90,
                alignItems: "center",
              }}
            >
              <Text color={theme.text.val}>Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista */}
        <SectionList
          sections={sections}
          keyExtractor={(item: any[], index) =>
            item.map((n) => n.id).join("-") + "-" + index
          }
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderSectionHeader={({ section: { title } }) => (
            <RNView style={{ paddingTop: 18, paddingBottom: 8 }}>
              <RNText
                style={{
                  fontWeight: "700",
                  fontSize: Math.max(14, 14 * fontScale),
                  color: theme.text.val,
                }}
              >
                {title}
              </RNText>
            </RNView>
          )}
          renderItem={({ item }) => (
            <RNView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              {item.map((note: any) => (
                <RNView
                  key={note.id}
                  style={{
                    width: columnOuterWidth,
                    marginRight: gapBetween,
                    alignItems: "center",
                  }}
                >
                  <NoteCard
                    note={note}
                    size={squareSize}
                    fontScale={fontScale}
                    onPress={openNote}
                    theme={theme}
                  />
                </RNView>
              ))}

              {item.length < columns &&
                Array.from({ length: columns - item.length }).map((_, i) => (
                  <RNView
                    key={`empty-${i}`}
                    style={{
                      width: columnOuterWidth,
                      marginRight: gapBetween,
                    }}
                  />
                ))}
            </RNView>
          )}
        />

        {/* BOTÃO + */}
        <TouchableOpacity
          onPress={() => router.push("/(notes)/new")}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: theme.contrast.val,
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

            elevation: 8,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <RNText style={{ 
            fontSize: 32, 
            color: theme.contrastText.val, 
            marginBottom: 4 
          }}>
            +
          </RNText>
        </TouchableOpacity>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
