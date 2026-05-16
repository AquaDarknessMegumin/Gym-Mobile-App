import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertModal } from '../components/AlertModal';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ProgressRing } from '../components/ProgressRing';
import { RoutineCard } from '../components/RoutineCard';
import { Card } from '../components/Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';

export const WorkoutScreen = ({ navigation }: any) => {
  const { weeklyGoals, routines, deleteRoutine } = useContext(DataContext) || { 
    weeklyGoals: { calories: 0, workouts: 0, duration: 0, volume: 0 }, 
    routines: [],
    deleteRoutine: async () => {}
  };

  const [routineToDelete, setRoutineToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (routineToDelete) {
      deleteRoutine(routineToDelete);
      setRoutineToDelete(null);
    }
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${hrs}h ${m}m` : `${hrs}h`;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.header2}>Workout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Card style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <Text style={Typography.header2}>Weekly goals</Text>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
          </View>
          <ProgressRing current={weeklyGoals.calories} total={10000} label="Calories" />
          <View style={styles.goalsStats}>
            <View style={styles.goalStatCol}>
              <Text style={Typography.bodySecondary}>Workouts</Text>
              <Text style={Typography.body}>{weeklyGoals.workouts}</Text>
            </View>
            <View style={styles.goalStatCol}>
              <Text style={Typography.bodySecondary}>Duration</Text>
              <Text style={Typography.body}>{formatDuration(weeklyGoals.duration)}</Text>
            </View>
          </View>
        </Card>

        <Text style={[Typography.header2, styles.sectionTitle]}>Routines</Text>

        <View style={styles.routinesActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
            onPress={() => navigation.navigate('CreateRoutine')}
          >
            <Ionicons name="clipboard-outline" size={16} color="#fff" style={styles.actionIcon} />
            <Text style={[Typography.body, { color: '#fff' }]}>New routine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ExerciseSelection', { mode: 'create', category: 'Explore', fromCreateRoutine: false })}
          >
            <Ionicons name="search-outline" size={16} color={Colors.text} style={styles.actionIcon} />
            <Text style={Typography.body}>Explore</Text>
          </TouchableOpacity>
        </View>

        {routines.map(r => (
          <RoutineCard
            key={r.id}
            title={r.title}
            description={r.description}
            onStart={() => navigation.navigate('ActiveWorkout', { category: r.title, routineId: r.id })}
            onEdit={() => navigation.navigate('CreateRoutine', { editRoutineId: r.id })}
            onDelete={() => setRoutineToDelete(r.id)}
          />
        ))}

      </ScrollView>

      <AlertModal
        visible={!!routineToDelete}
        title="Delete Routine"
        message="Are you sure you want to delete this routine? This action cannot be undone."
        type="delete"
        confirmText="Delete"
        onClose={() => setRoutineToDelete(null)}
        onConfirm={confirmDelete}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  goalsCard: { marginBottom: 24 },
  goalsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalsStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingHorizontal: 16 },
  goalStatCol: { alignItems: 'center' },
  sectionTitle: { marginBottom: 16 },
  routinesActions: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionIcon: { marginRight: 8 },
});