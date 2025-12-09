import { Text } from '@/components/ui/StyledText';
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
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
  onDeleteTags: (tag: string) => Promise<void>;
}

export const FilterDrawer = ({
  visible,
  onClose,
  tags,
  selectedTag,
  onSelectTag,
  isDarkMode,
  onToggleTheme,
  onDeleteTags
}: Props) => {
  const styles = useThemeStyles(isDarkMode);
  const screenWidth = Dimensions.get('window').width;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

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
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.drawerHeader}>Filtros</Text>
                <TouchableOpacity onPress={() => setIsDeleteVisible((prevState) => !prevState)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="trash-2" size={22} color='#cf6679' />
                </TouchableOpacity>
              </View>
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
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', gap: 15 }}>
                      {isDeleteVisible && (item.name !== 'Sem tag' && item.name !== 'Todas as notas')
                        && (
                          <TouchableOpacity onPress={() => onDeleteTags(item.name)} >
                            <Feather name="minus-circle" size={19} color='#cf6679' />
                          </TouchableOpacity>
                        )  
                      }
                      <Text style={styles.drawerCount}>{item.count}</Text>
                    </View>
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