import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

export const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);

  const handleSignIn = () => {
    if (email && password) {
      authContext?.login(email, password);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="barbell" size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>G-Fitness</Text>
        </View>

        <View style={styles.header}>
          <Text style={[Typography.header1, styles.title]}>Welcome Back</Text>
          <Text style={[Typography.bodySecondary, styles.subtitle]}>
            Sign in to continue your fitness journey
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={{ height: 16 }} />
          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton 
            title="Sign In" 
            onPress={handleSignIn} 
            style={styles.button} 
          />
        </View>

        <View style={styles.footer}>
          <Text style={Typography.bodySecondary}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[Typography.body, { color: Colors.primary, fontWeight: 'bold' }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: Colors.surface },
  scrollContent: { flexGrow: 1, padding: 32, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: { 
    marginTop: 16, 
    fontSize: 28, 
    fontWeight: '900', 
    color: Colors.primary,
    letterSpacing: -0.5
  },
  header: { marginBottom: 32 },
  title: { marginBottom: 8, fontSize: 32 },
  subtitle: { fontSize: 16 },
  form: { width: '100%' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 12, marginBottom: 24 },
  forgotText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  button: { borderRadius: 16, height: 56 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
});
