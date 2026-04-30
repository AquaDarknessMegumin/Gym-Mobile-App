import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { AccountSettingsScreen } from '../screens/AccountSettingsScreen';

const Stack = createNativeStackNavigator();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
    </Stack.Navigator>
  );
};
