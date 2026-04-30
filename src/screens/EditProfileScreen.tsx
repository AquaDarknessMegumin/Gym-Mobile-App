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

export const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useContext(AuthContext) || {};
  const [username, setUsername] = useState(user?.username || '');
  const [showAlert, setShowAlert] = useState(false);

  const handleSave = async () => {
    if (updateUser) {
      await updateUser({ username });
      setShowAlert(true);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={Typography.header2}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username.slice(0, 2).toUpperCase()}</Text>
          </View>
          <TouchableOpacity>
            <Text style={[Typography.body, { color: Colors.primary, marginTop: 12, fontWeight: '600' }]}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        <InputField
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />

        <View style={{ marginTop: 24 }}>
          <PrimaryButton title="Save Changes" onPress={handleSave} />
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
        title="Profile Updated"
        message="Your profile has been successfully updated."
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
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },
});
