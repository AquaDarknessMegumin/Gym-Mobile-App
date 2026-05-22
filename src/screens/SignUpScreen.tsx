import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

export const SignUpScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  // If the context is somehow undefined (should never happen in production), bail out gracefully
  if (!authContext) {
    return null;
  }

  const {
    register,
    isRegistering = false,
    cooldown = 0,
    registrationModalVisible = false,
    hideRegistrationModal,
  } = authContext;

  const handleSignUp = () => {
    if (cooldown > 0) {
      // Optional: you could show a toast here
      return;
    }
    if (email && password && username) {
      register?.(email, username, password);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[Typography.header1, styles.title]}>Create Account</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Join G-Fitness and start tracking your progress
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Enter your name"
            value={username}
            onChangeText={setUsername}
          />
          <View style={{ height: 16 }} />
          <InputField
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ height: 16 }} />
          <InputField
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          <PrimaryButton 
            title="Create Account" 
            onPress={handleSignUp} 
            style={styles.button} 
            disabled={isRegistering || cooldown > 0}
          />
        </View>

        <View style={styles.footer}>
          <Text style={Typography.bodySecondary}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[Typography.body, { color: Colors.primary, fontWeight: 'bold' }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Registration success modal */}
      <Modal
        transparent={true}
        visible={registrationModalVisible}
        animationType="fade"
        onRequestClose={hideRegistrationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check Your Email</Text>
            <Text style={styles.modalMessage}>A confirmation link has been sent to your email. Please confirm before logging in.</Text>
            <Pressable onPress={hideRegistrationModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: Colors.surface },
  scrollContent: { flexGrow: 1, padding: 32 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  header: { marginBottom: 32 },
  title: { marginBottom: 8, fontSize: 32 },
  subtitle: { fontSize: 16 },
  form: { width: '100%' },
  termsContainer: { marginTop: 16, marginBottom: 32 },
  termsText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  link: { color: Colors.primary, fontWeight: '600' },
  button: { borderRadius: 16, height: 56 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  // modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
