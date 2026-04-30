import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton = ({ title, onPress, isLoading, disabled, style, textStyle }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || isLoading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors.surface} />
      ) : (
        <Text style={[Typography.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30, // pill shape
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabled: {
    opacity: 0.7,
  },
});
