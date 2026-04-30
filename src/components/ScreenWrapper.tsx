import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export const ScreenWrapper = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
