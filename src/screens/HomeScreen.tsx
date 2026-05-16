import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

export const HomeScreen = ({ navigation }: any) => {
  const { workouts, weeklyGoals } = useContext(DataContext) || {
    workouts: [],
    weeklyGoals: { calories: 0, workouts: 0, duration: 0, volume: 0 }
  };
  const { user } = useContext(AuthContext) || { user: null };
  const username = user?.username || 'User';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${hrs}h ${m}m` : `${hrs}h`;
  };

  return (
    <ScreenWrapper style={styles.container}>

      {/* Dark Purple Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{username} 💪</Text>
          <Text style={styles.subtitle}>Let's crush your goals today</Text>
        </View>
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flame-outline" size={18} color="#FFB347" />
          <Text style={styles.statValue}>{weeklyGoals.calories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="barbell-outline" size={18} color="#7DD3FC" />
          <Text style={styles.statValue}>{weeklyGoals.workouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={18} color="#86EFAC" />
          <Text style={styles.statValue}>{formatDuration(weeklyGoals.duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Quick Actions */}
        <Text style={[Typography.header2, styles.sectionTitle]}>Quick Start</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate('Workout')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="add-circle" size={28} color="#fff" />
            </View>
            <Text style={[styles.quickActionText, { color: '#fff' }]}>New Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Workout')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
              <Ionicons name="clipboard-outline" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.quickActionText}>My Routines</Text>
          </TouchableOpacity>
        </View>

                {/* Streak Bar */}
                <Card style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>This week</Text>
            <Text style={styles.streakBadge}>🔥 streak</Text>
          </View>
          <View style={styles.streakDays}>
            {['M','T','W','T','F','S','S'].map((day, i) => {
              const d = new Date();
              const dayOfWeek = d.getDay();
              const mondayOffset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
              const targetDate = new Date(d);
              targetDate.setDate(d.getDate() + mondayOffset + i);
              const dateStr = targetDate.toISOString().split('T')[0];
              const hasWorkout = workouts.some(w => new Date(w.date).toISOString().split('T')[0] === dateStr);
              return (
                <View key={i} style={styles.streakDayCol}>
                  <View style={[styles.streakDot, { backgroundColor: hasWorkout ? Colors.primary : '#E5E5EA' }]}>
                    {hasWorkout && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={styles.streakDayLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Recent Activity */}
        <Text style={[Typography.header2, styles.sectionTitle]}>Recent Activity</Text>

        {workouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="fitness-outline" size={48} color="#E5E5EA" />
            <Text style={[Typography.bodySecondary, { marginTop: 12, textAlign: 'center' }]}>
              No workouts yet. Start your first workout!
            </Text>
          </Card>
        ) : (
          workouts.slice(0, 10).map((w) => (
            <Card key={w.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutIcon}>
                  <Ionicons name="barbell" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={Typography.body}>{w.title}</Text>
                  <Text style={[Typography.bodySecondary, { fontSize: 12 }]}>{formatDate(w.date)}</Text>
                </View>
                <View style={styles.workoutBadge}>
                  <Text style={styles.workoutBadgeText}>{w.category}</Text>
                </View>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStatItem}>
                  <Ionicons name="time-outline" size={14} color={Colors.primary} />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4, color: Colors.primary }]}>{w.duration}min</Text>
                </View>
                <View style={styles.workoutStatItem}>
                  <Ionicons name="flame-outline" size={14} color="#F59E0B" />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4, color: '#F59E0B' }]}>{w.calories} kcal</Text>
                </View>
                <View style={styles.workoutStatItem}>
                  <Ionicons name="trending-up-outline" size={14} color="#22C55E" />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4, color: '#22C55E' }]}>{w.volume.toLocaleString()}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0 },

  header: {
    backgroundColor: '#3D1F7A',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  username: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  calendarBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  statsRow: {
    backgroundColor: '#3D1F7A',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { fontSize: 15, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)' },

  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { marginBottom: 16 },

  streakCard: { marginBottom: 20, padding: 14 },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  streakTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  streakBadge: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  streakDays: { flexDirection: 'row', justifyContent: 'space-between' },
  streakDayCol: { alignItems: 'center', gap: 4 },
  streakDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  streakDayLabel: { fontSize: 9, color: '#8E8E93' },

  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  quickActionIcon: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: { fontSize: 14, fontWeight: '600', color: Colors.text },

  emptyCard: { alignItems: 'center', padding: 40 },
  workoutCard: { marginBottom: 12, padding: 16 },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  workoutIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  workoutBadge: {
    backgroundColor: 'rgba(124,58,237,0.1)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  workoutBadgeText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  workoutStats: { flexDirection: 'row', gap: 20, paddingLeft: 52 },
  workoutStatItem: { flexDirection: 'row', alignItems: 'center' },
});