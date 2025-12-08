import React, { useEffect, useRef } from 'react';
import { 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View, 
  Text, 
  ScrollView, 
  Animated, 
  Dimensions 
} from 'react-native';
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
  const screenWidth = Dimensions.get('window').width;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -screenWidth, 
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleSelect = (tagName: string) => {
    onSelectTag(tagName);
    handleClose();
  };

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="none" 
      onRequestClose={handleClose} 
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={{ flex: 1, width: '100%' }} 
          activeOpacity={1} 
          onPress={handleClose}
        >
          <TouchableWithoutFeedback>

            <Animated.View 
              style={[
                styles.drawerContainer, 
                { transform: [{ translateX: slideAnim }] }
              ]}
            >
              <Text style={styles.drawerHeader}>filtros</Text>

              <ScrollView>
                {tags.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.drawerItem}
                    onPress={() => handleSelect(item.name)}
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

            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};