import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, Text, ScrollView } from 'react-native';
import { styles } from '../../constants/theme';

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
}

export const FilterDrawer = ({ visible, onClose, tags, selectedTag, onSelectTag }: Props) => {
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
                  onPress={() => { onSelectTag(item.name); onClose(); }}
                >
                  <Text style={[styles.drawerItemText, selectedTag === item.name && styles.drawerItemTextSelected]}>
                    {item.name}
                  </Text>
                  <Text style={styles.drawerCount}>{item.count}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};