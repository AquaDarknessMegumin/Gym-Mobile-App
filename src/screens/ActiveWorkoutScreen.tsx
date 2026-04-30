import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';
import { AlertModal } from '../components/AlertModal';

// Global mock state just for this session demo
export const activeRoutineExercises: any = {
  Push: [],
  Pull: [],
  Legs: []
};

export const ActiveWorkoutScreen = ({ route, navigation }: any) => {
  const { category, routineId } = route.params;
  const { routines, addWorkout, addRoutine } = useContext(DataContext) || { routines: [], addWorkout: async () => {}, addRoutine: async () => {} };
  const [exercises, setExercises] = useState<any[]>([]);

  // --- Live Timer ---
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  // --- Alert Modal ---
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

  const sessionKey = routineId || category;

  // Pre-populate global mock state if it doesn't exist or is empty for this sessionKey
  if (!activeRoutineExercises[sessionKey] || activeRoutineExercises[sessionKey].length === 0) {
    activeRoutineExercises[sessionKey] = [];
    
    // If it's a custom routine, load its default exercises
    if (routineId) {
      const routine = routines.find((r: any) => r.id === routineId);
      if (routine && routine.exercises) {
        activeRoutineExercises[sessionKey] = routine.exercises.map((ex: any) => ({
          ...ex,
          sets: '3',
          reps: '10',
          completed: false,
          locked: false,
          completedSets: 0
        }));
      }
    }
  }

  // Refresh when coming back from selection screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const mapped = (activeRoutineExercises[sessionKey] || []).map((ex: any) => ({
        ...ex,
        sets: ex.sets || '3',
        reps: ex.reps || '10',
        completed: ex.completed || false,
        locked: ex.locked || false,
        completedSets: ex.completedSets || 0
      }));
      setExercises(mapped);
    });
    return unsubscribe;
  }, [navigation, sessionKey]);

  const updateExercise = (index: number, field: string, value: any) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
    activeRoutineExercises[sessionKey] = newExercises;
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
    activeRoutineExercises[sessionKey] = newExercises;
  };

  const logSet = (index: number) => {
    const ex = exercises[index];
    if (ex.completed) return;

    let newCompletedSets = ex.completedSets + 1;
    let newCompleted = false;

    if (newCompletedSets >= parseInt(ex.sets)) {
      newCompleted = true;
    }

    const newExercises = [...exercises];
    newExercises[index] = { ...ex, completedSets: newCompletedSets, completed: newCompleted };
    setExercises(newExercises);
    activeRoutineExercises[sessionKey] = newExercises;
  };

  // --- Derived State ---
  const allCompleted = exercises.length > 0 && exercises.every(ex => ex.completed);
  const completedCount = exercises.filter(ex => ex.completed).length;

  // --- Save as Routine ---
  const handleSaveAsRoutine = async () => {
    if (exercises.length === 0) {
      showAlert('No Exercises', 'Please add exercises before saving as a routine.');
      return;
    }
    const routineExercises = exercises.map(ex => ({ id: ex.id, name: ex.name }));
    await addRoutine({
      title: `${category} Routine`,
      description: routineExercises.map(e => e.name).join(', '),
      exercises: routineExercises,
    });
    showAlert('Saved!', 'This workout has been saved as a routine. You can find it on your Workout page.', 'success');
  };

  // --- Finish Workout ---
  const handleFinish = async () => {
    if (exercises.length === 0) {
      showAlert('Empty Workout', 'Please add at least one exercise before finishing your workout.');
      return;
    }

    if (!allCompleted) {
      showAlert('Incomplete', `You have ${exercises.length - completedCount} exercise${exercises.length - completedCount > 1 ? 's' : ''} remaining. Complete all exercises before finishing.`);
      return;
    }

    let totalVolume = 0;
    exercises.forEach(ex => {
      if (ex.completed) {
        totalVolume += ex.completedSets * parseInt(ex.reps) * 20; 
      }
    });

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const calories = Math.floor(durationMinutes * 8.33);

    await addWorkout({
      title: `${category} Day`,
      category: category,
      duration: durationMinutes,
      volume: totalVolume,
      calories: calories
    });

    delete activeRoutineExercises[sessionKey];
    if (timerRef.current) clearInterval(timerRef.current);

    showAlert('Great job!', `Workout completed in ${formatTimer(elapsedSeconds)}! It has been recorded and synced to your calendar.`, 'success', () => {
      navigation.goBack();
    });
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[Typography.header1, styles.headerTitle]}>
          {category}
        </Text>
        <View style={styles.placeholderBtn} />
      </View>

      {/* Timer Bar */}
      <View style={styles.timerBar}>
        <View style={styles.timerLeft}>
          <Ionicons name="time-outline" size={20} color={Colors.primary} />
          <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
        </View>
        <View style={styles.timerRight}>
          <Text style={styles.progressText}>{completedCount}/{exercises.length} done</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color="#C7C7CC" style={{ marginBottom: 16 }} />
            <Text style={Typography.bodySecondary}>No exercises added yet.</Text>
            <Text style={[Typography.bodySecondary, { textAlign: 'center', marginTop: 8 }]}>Tap the button below to start building your routine.</Text>
          </View>
        ) : (
          exercises.map((ex, index) => (
            <Card key={index} style={[styles.exerciseCard, ex.completed && styles.exerciseCompleted]}>
              <View style={styles.cardHeader}>
                <Text style={[Typography.header2, { flex: 1 }, ex.completed && styles.textCompleted]}>{ex.name}</Text>
                
                {ex.locked && !ex.completed && (
                  <TouchableOpacity onPress={() => updateExercise(index, 'locked', false)} style={styles.unlockBtn}>
                    <Ionicons name="lock-closed" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                )}
                {!ex.locked && !ex.completed && (
                  <TouchableOpacity onPress={() => removeExercise(index)} style={styles.deleteBtn}>
                    <Ionicons name="close" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
              
              {!ex.locked ? (
                // Edit Mode
                <View style={styles.editRow}>
                  <View style={styles.inputsContainer}>
                    <View style={styles.pillInput}>
                      <TextInput 
                        style={styles.numberInput} 
                        value={ex.sets} 
                        onChangeText={(val) => updateExercise(index, 'sets', val)}
                        keyboardType="numeric"
                      />
                      <Text style={Typography.bodySecondary}>Sets</Text>
                    </View>
                    
                    <Ionicons name="close" size={16} color={Colors.textSecondary} style={{ marginHorizontal: 4 }} />
                    
                    <View style={styles.pillInput}>
                      <TextInput 
                        style={styles.numberInput} 
                        value={ex.reps} 
                        onChangeText={(val) => updateExercise(index, 'reps', val)}
                        keyboardType="numeric"
                      />
                      <Text style={Typography.bodySecondary}>Reps</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.lockBtn} 
                    onPress={() => updateExercise(index, 'locked', true)}
                  >
                    <Text style={[Typography.body, { color: Colors.surface, fontWeight: 'bold' }]}>Lock</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Track Mode
                <View style={styles.trackRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={Typography.bodySecondary}>
                      Target: {ex.sets} sets of {ex.reps}
                    </Text>
                    <Text style={[Typography.header2, { color: ex.completed ? '#22C55E' : Colors.text, marginTop: 4 }]}>
                      {ex.completedSets} / {ex.sets} Sets
                    </Text>
                  </View>
                  
                  {!ex.completed ? (
                    <TouchableOpacity style={styles.logBtn} onPress={() => logSet(index)}>
                      <Ionicons name="add" size={28} color={Colors.surface} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                      <Text style={[Typography.body, { color: '#22C55E', fontWeight: 'bold', marginLeft: 4 }]}>Done</Text>
                    </View>
                  )}
                </View>
              )}
            </Card>
          ))
        )}

        <TouchableOpacity 
          style={styles.addExerciseBtn}
          onPress={() => navigation.navigate('ExerciseSelection', routineId 
            ? { mode: 'create', category: sessionKey }
            : { category: category }
          )}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
          <Text style={[Typography.body, { color: Colors.primary, fontWeight: 'bold', marginLeft: 8 }]}>Add Exercise</Text>
        </TouchableOpacity>

        {/* Save as Routine button */}
        {exercises.length > 0 && !routineId && (
          <TouchableOpacity 
            style={styles.saveRoutineBtn}
            onPress={handleSaveAsRoutine}
          >
            <Ionicons name="bookmark-outline" size={20} color={Colors.primary} />
            <Text style={[Typography.body, { color: Colors.primary, fontWeight: 'bold', marginLeft: 8 }]}>Save as Routine</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title={allCompleted ? "Finish Workout" : `${completedCount}/${exercises.length} Complete`}
          onPress={handleFinish}
          disabled={!allCompleted}
          style={!allCompleted ? styles.disabledBtn : undefined}
        />
      </View>

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  placeholderBtn: { width: 40 },
  headerTitle: { flex: 1, textAlign: 'center' },

  // Timer Bar
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    borderRadius: 12,
    marginBottom: 8,
  },
  timerLeft: { flexDirection: 'row', alignItems: 'center' },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
    fontVariant: ['tabular-nums'],
  },
  timerRight: { flexDirection: 'row', alignItems: 'center' },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  scrollContent: { padding: 16, paddingBottom: 120 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 32 },
  exerciseCard: { marginBottom: 16, padding: 20 },
  exerciseCompleted: { backgroundColor: 'rgba(34, 197, 94, 0.08)', borderColor: 'rgba(34, 197, 94, 0.3)', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  textCompleted: { opacity: 0.6 },
  unlockBtn: { padding: 4, backgroundColor: 'rgba(99, 56, 171, 0.1)', borderRadius: 12 },
  deleteBtn: { padding: 4, backgroundColor: '#F2F2F7', borderRadius: 12, marginLeft: 8 },
  
  // Edit Mode Styles
  editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputsContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  pillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  numberInput: { 
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center'
  },
  lockBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Track Mode Styles
  trackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 56, 171, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  saveRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  disabledBtn: { opacity: 0.5 },
});
