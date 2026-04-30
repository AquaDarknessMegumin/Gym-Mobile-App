import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';
import { AlertModal } from '../components/AlertModal';

// Module-level temp storage to survive component remounts during navigation
let _tempFormState: { title: string; description: string; exercises: any[] } | null = null;

export const CreateRoutineScreen = ({ route, navigation }: any) => {
  const { addRoutine, updateRoutine, routines } = useContext(DataContext) || { 
    addRoutine: async () => {}, 
    updateRoutine: async () => {},
    routines: [] 
  };
  const { editRoutineId } = route.params || {};

  // Initialize state: restore from temp storage if returning from ExerciseSelection
  const [title, setTitle] = useState(_tempFormState?.title || '');
  const [description, setDescription] = useState(_tempFormState?.description || '');
  const [selectedExercises, setSelectedExercises] = useState<any[]>(_tempFormState?.exercises || []);

  // Clear temp storage after restoring
  useEffect(() => {
    _tempFormState = null;
  }, []);

  // Pre-fill data if editing (only on first mount, not when returning from exercise selection)
  useEffect(() => {
    if (editRoutineId && !_tempFormState) {
      const routine = routines.find((r: any) => r.id === editRoutineId);
      if (routine && !title && !description && selectedExercises.length === 0) {
        setTitle(routine.title);
        setDescription(routine.description);
        setSelectedExercises(routine.exercises || []);
      }
    }
  }, [editRoutineId]);

  // Capture selected exercises returned from ExerciseSelection screen
  useEffect(() => {
    if (route.params?.selectedExercises) {
      setSelectedExercises(prev => {
        const newEx = route.params.selectedExercises.filter(
          (ex: any) => !prev.find((p: any) => p.id === ex.id)
        );
        return [...prev, ...newEx];
      });
    }
  }, [route.params?.selectedExercises]);

  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type?: any; onConfirm?: () => void }>({
    visible: false,
    title: '',
    message: ''
  });

  const showAlert = (alertTitle: string, message: string, type: any = 'info', onConfirm?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title: alertTitle, message, type, onConfirm });
    } else {
      if (onConfirm) {
        Alert.alert(alertTitle, message, [{ text: 'OK', onPress: onConfirm }]);
      } else {
        Alert.alert(alertTitle, message);
      }
    }
  };

  // Save form state to temp storage before navigating away
  const navigateToExerciseSelection = () => {
    _tempFormState = { title, description, exercises: selectedExercises };
    navigation.navigate('ExerciseSelection', { 
      mode: 'create',
      fromCreateRoutine: true,
      editRoutineId: editRoutineId 
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert('Missing Info', 'Please give your routine a name.');
      return;
    }
    if (selectedExercises.length === 0) {
      showAlert('Missing Info', 'Please add at least one exercise.');
      return;
    }

    try {
      if (editRoutineId) {
        await updateRoutine(editRoutineId, {
          title,
          description: description || 'Custom routine',
          exercises: selectedExercises,
        });
      } else {
        await addRoutine({
          title,
          description: description || 'Custom routine',
          exercises: selectedExercises,
        });
      }

      _tempFormState = null; // Clear temp on successful save
      showAlert('Success', `Routine ${editRoutineId ? 'updated' : 'saved'} successfully!`, 'success', () => {
        navigation.navigate('WorkoutMain');
      });
    } catch (error) {
      console.error('Save failed', error);
      showAlert('Error', 'Failed to save routine. Please try again.', 'error');
    }
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { _tempFormState = null; navigation.goBack(); }} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[Typography.header2, { flex: 1, textAlign: 'center', marginRight: 40 }]}>
          {editRoutineId ? 'Edit Routine' : 'New Routine'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.bodySecondary, styles.label]}>Routine Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="e.g., Full Body Friday"
          placeholderTextColor={Colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[Typography.bodySecondary, styles.label]}>Description (Optional)</Text>
        <TextInput 
          style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
          placeholder="e.g., High intensity strength training"
          placeholderTextColor={Colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <View style={styles.sectionHeader}>
          <Text style={Typography.header2}>Exercises</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={navigateToExerciseSelection}
          >
            <Ionicons name="add-circle" size={20} color={Colors.primary} />
            <Text style={[Typography.body, { color: Colors.primary, marginLeft: 4, fontWeight: 'bold' }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {selectedExercises.map((ex) => (
          <Card key={ex.id} style={styles.exerciseCard}>
            <View style={styles.exerciseRow}>
              <Ionicons name="barbell" size={20} color={Colors.primary} />
              <Text style={[Typography.body, styles.exerciseName]}>{ex.name}</Text>
              <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        {selectedExercises.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={48} color="#E5E5EA" />
            <Text style={[Typography.bodySecondary, { marginTop: 12 }]}>No exercises added yet.</Text>
          </View>
        )}

        <PrimaryButton 
          title={editRoutineId ? "Update Routine" : "Save Routine"} 
          onPress={handleSave} 
          style={styles.saveBtn}
        />
      </ScrollView>

      <AlertModal 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onConfirm={() => {
          setAlertConfig({ ...alertConfig, visible: false });
          alertConfig.onConfirm?.();
        }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: '#FAFAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20 },
  label: { marginBottom: 8, fontWeight: 'bold' },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  exerciseCard: {
    marginBottom: 12,
    padding: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    flex: 1,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    marginBottom: 24,
  },
  saveBtn: {
    marginTop: 24,
    marginBottom: 40,
  }
});
