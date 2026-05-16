import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { activeRoutineExercises } from './ActiveWorkoutScreen';

const EXERCISE_DICTIONARY: Record<string, { id: string; name: string }[]> = {
  Push: [
    { id: 'p1', name: 'Barbell Bench Press' },
    { id: 'p2', name: 'Incline Dumbbell Press' },
    { id: 'p3', name: 'Overhead Press' },
    { id: 'p4', name: 'Tricep Pushdown' },
    { id: 'p5', name: 'Chest Flyes' },
  ],
  Pull: [
    { id: 'u1', name: 'Pull-ups' },
    { id: 'u2', name: 'Barbell Rows' },
    { id: 'u3', name: 'Lat Pulldowns' },
    { id: 'u4', name: 'Bicep Curls' },
    { id: 'u5', name: 'Face Pulls' },
  ],
  Legs: [
    { id: 'l1', name: 'Barbell Squats' },
    { id: 'l2', name: 'Romanian Deadlifts' },
    { id: 'l3', name: 'Leg Press' },
    { id: 'l4', name: 'Calf Raises' },
    { id: 'l5', name: 'Leg Extensions' },
  ],
  Abs: [
    { id: 'a1', name: 'Plank' },
    { id: 'a2', name: 'Crunches' },
    { id: 'a3', name: 'Leg Raises' },
    { id: 'a4', name: 'Russian Twists' },
    { id: 'a5', name: 'Bicycle Kicks' },
    { id: 'a6', name: 'Cable Crunches' },
  ],
  Cardio: [
    { id: 'c1', name: 'Treadmill Run' },
    { id: 'c2', name: 'Jump Rope' },
    { id: 'c3', name: 'Cycling' },
    { id: 'c4', name: 'Rowing Machine' },
    { id: 'c5', name: 'Stair Climber' },
    { id: 'c6', name: 'Burpees' },
  ],
};

export const ExerciseSelectionScreen = ({ route, navigation }: any) => {
  const { category, mode = 'active', editRoutineId, fromCreateRoutine } = route.params;

  // Flatten dictionary for 'create' mode
  const allExercises = Object.values(EXERCISE_DICTIONARY).flat();
  const availableExercises = mode === 'create' ? allExercises : (EXERCISE_DICTIONARY[category] || []);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = availableExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = () => {
    const selected = availableExercises.filter(ex => selectedIds.includes(ex.id));
    
    if (fromCreateRoutine) {
      // Called from CreateRoutine screen — pass exercises back
      navigation.navigate('CreateRoutine', { 
        selectedExercises: selected,
        editRoutineId: editRoutineId
      });
    } else if (mode === 'create') {
      // Called from ActiveWorkout for a custom routine — add to session and go back
      const sessionExercises = activeRoutineExercises[category] || [];
      activeRoutineExercises[category] = [...sessionExercises, ...selected];
      navigation.goBack();
    } else {
      activeRoutineExercises[category] = [...(activeRoutineExercises[category] || []), ...selected];
      navigation.goBack();
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Text style={[Typography.body, { color: Colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[Typography.header2, { flex: 1, textAlign: 'center' }]}>
          Exercises
        </Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.header2, styles.subtitle]}>
          {mode === 'create' ? 'All Exercises' : category}
        </Text>

        {filteredExercises.map((ex) => {
          const isSelected = selectedIds.includes(ex.id);
          return (
            <TouchableOpacity 
              key={ex.id} 
              style={[styles.row, isSelected && styles.rowSelected]} 
              onPress={() => toggleSelection(ex.id)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="barbell" size={20} color={isSelected ? Colors.primary : Colors.textSecondary} />
              </View>
              <Text style={[Typography.body, styles.exerciseName, isSelected && { fontWeight: 'bold' }]}>{ex.name}</Text>
              
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color={Colors.surface} />}
              </View>
            </TouchableOpacity>
          );
        })}
        {filteredExercises.length === 0 && (
          <Text style={[Typography.bodySecondary, { textAlign: 'center', marginTop: 32 }]}>
            No exercises found.
          </Text>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {selectedIds.length > 0 && (
        <View style={styles.fabContainer}>
          <PrimaryButton 
            title={`Add ${selectedIds.length} Exercise${selectedIds.length > 1 ? 's' : ''}`} 
            onPress={handleSave} 
            style={styles.fab}
          />
        </View>
      )}
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
  headerBtn: { width: 60 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: Colors.text },
  scrollContent: { padding: 16, paddingBottom: 120 },
  subtitle: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rowSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    padding: 14, // adjust for border width
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  exerciseName: { flex: 1 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#C7C7CC',
    alignItems: 'center', justifyContent: 'center'
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(250, 250, 252, 0.9)',
  },
  fab: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  }
});
