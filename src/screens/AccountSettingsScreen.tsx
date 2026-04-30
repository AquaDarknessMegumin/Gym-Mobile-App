import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { AlertModal } from '../components/AlertModal';

export const AccountSettingsScreen = ({ navigation }: any) => {
  const { user, updateUser } = useContext(AuthContext) || {};
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSave = async () => {
    if (updateUser) {
      await updateUser({ email });
      setShowAlert(true);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.header2}>Account Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Credentials</Text>
          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter your email"
          />
          <View style={{ height: 16 }} />
          <InputField
            label="New Password"
            placeholder="Enter new password to change"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={{ marginTop: 32 }}>
          <PrimaryButton title="Update Account" onPress={handleSave} />
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AlertModal
        visible={showAlert}
        title="Account Updated"
        message="Your account settings have been successfully updated."
        type="success"
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: Colors.surface },
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
  content: { padding: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Colors.textSecondary, 
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },
});
