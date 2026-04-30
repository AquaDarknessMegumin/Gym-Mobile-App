import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

const MENU_ITEMS = [
  { icon: 'person-outline' as const, label: 'Edit Profile', route: 'EditProfile', color: Colors.primary },
  { icon: 'lock-closed-outline' as const, label: 'Account Settings', route: 'AccountSettings', color: '#3B82F6' },
  { icon: 'notifications-outline' as const, label: 'Notifications', route: null, color: '#F59E0B' },
  { icon: 'moon-outline' as const, label: 'Appearance', route: null, color: '#8B5CF6' },
  { icon: 'help-circle-outline' as const, label: 'Help & Support', route: null, color: '#22C55E' },
  { icon: 'information-circle-outline' as const, label: 'About', route: null, color: Colors.textSecondary },
];

export const SettingsScreen = ({ navigation }: any) => {
  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.header2}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.label}
              style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => item.route && navigation.navigate(item.route)}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: '#FAFAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 16, color: Colors.text },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF3B30', marginLeft: 8 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textSecondary },
});
