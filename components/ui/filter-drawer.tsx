import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, ScrollView } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useThemeStyles } from '../../constants/theme';

interface TagCount {
  name: string;
  count: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  tags: TagCount[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;

  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const FilterDrawer = ({
  visible,
  onClose,
  tags,
  selectedTag,
  onSelectTag,
  isDarkMode,
  onToggleTheme
}: Props) => {
  const styles = useThemeStyles(isDarkMode);

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.drawerContainer}>
            <Text style={styles.drawerHeader}>filtros</Text>

            <ScrollView>
              {tags.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.drawerItem}
                  onPress={() => {
                    onSelectTag(item.name);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.drawerItemText,
                      selectedTag === item.name && styles.drawerItemTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.drawerCount}>{item.count}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={onToggleTheme}
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDarkMode ? "#333" : "#f0f0f0", 
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                elevation: 5,
                borderWidth: isDarkMode ? 0 : 1,
                borderColor: '#e0e0e0'
              }}
            >
              <Feather
                name={isDarkMode ? "sun" : "moon"}
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};