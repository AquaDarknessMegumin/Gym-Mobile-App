import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'error' | 'delete';
}

export const AlertModal = ({ 
  visible, 
  title, 
  message, 
  onClose, 
  onConfirm, 
  confirmText = 'OK', 
  cancelText = 'Cancel',
  type = 'info'
}: Props) => {
  const isDelete = type === 'delete';
  const isError = type === 'error';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={[Typography.header2, { marginBottom: 8 }]}>{title}</Text>
          <Text style={[Typography.body, styles.message]}>{message}</Text>
          
          <View style={styles.actions}>
            {onConfirm && (
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={onClose}
              >
                <Text style={[Typography.body, { fontWeight: 'bold' }]}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.btn, 
                isDelete || isError ? styles.btnDelete : styles.btnConfirm,
                !onConfirm && { marginLeft: 0 }
              ]} 
              onPress={onConfirm || onClose}
            >
              <Text style={[Typography.body, { color: 'white', fontWeight: 'bold' }]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  btnCancel: {
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  btnConfirm: {
    backgroundColor: Colors.primary,
  },
  btnDelete: {
    backgroundColor: '#FF3B30',
  }
});
