import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

interface Props {
  title: string;
  description: string;
  onStart: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RoutineCard = ({ title, description, onStart, onEdit, onDelete }: Props) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleEdit = () => {
    setMenuVisible(false);
    onEdit?.();
  };

  const handleDelete = () => {
    setMenuVisible(false);
    onDelete?.();
  };

  return (
    <Card style={[{ zIndex: menuVisible ? 1000 : 1, overflow: 'visible', position: 'relative' }, menuVisible && { elevation: 10 }]}>
      <View style={styles.header}>
        <Text style={[Typography.header2, { flex: 1 }]}>{title}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.menuBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleEdit}>
                <Ionicons name="pencil-outline" size={16} color={Colors.text} style={{ marginRight: 8 }} />
                <Text style={Typography.body}>Edit</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.dropdownItem} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color="#FF3B30" style={{ marginRight: 8 }} />
                <Text style={[Typography.body, { color: '#FF3B30' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={[Typography.bodySecondary, styles.description]} numberOfLines={2}>
        {description}
      </Text>
      <PrimaryButton title="Start routine" onPress={onStart} style={styles.button} textStyle={{ fontSize: 14 }} />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, zIndex: 10 },
  actions: { flexDirection: 'row', alignItems: 'center', position: 'relative', zIndex: 20 },
  menuBtn: { padding: 8, borderRadius: 20 },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 9999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  description: { marginBottom: 16, lineHeight: 20 },
  button: { paddingVertical: 12, borderRadius: 8 },
});
