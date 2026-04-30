import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';

export const HomeScreen = ({ navigation }: any) => {
  const { workouts, weeklyGoals } = useContext(DataContext) || { 
    workouts: [], 
    weeklyGoals: { calories: 0, workouts: 0, duration: 0, volume: 0 } 
  };

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 💪</Text>
          <Text style={styles.subtitle}>Let's crush your goals today</Text>
        </View>
        <TouchableOpacity 
          style={styles.calendarBtn}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Ionicons name="flame-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{weeklyGoals.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              <Ionicons name="barbell-outline" size={22} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{weeklyGoals.workouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Ionicons name="time-outline" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{formatDuration(weeklyGoals.duration)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[Typography.header2, styles.sectionTitle]}>Quick Start</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard} 
            onPress={() => navigation.navigate('Workout')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(124, 58, 237, 0.1)' }]}>
              <Ionicons name="add-circle" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>New Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionCard} 
            onPress={() => navigation.navigate('Workout')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Ionicons name="clipboard-outline" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.quickActionText}>My Routines</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={[Typography.header2, styles.sectionTitle]}>Recent Activity</Text>

        {workouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="fitness-outline" size={48} color="#E5E5EA" />
            <Text style={[Typography.bodySecondary, { marginTop: 12, textAlign: 'center' }]}>
              No workouts yet. Start your first workout to see your activity here!
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
                  <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4 }]}>{w.duration}min</Text>
                </View>
                <View style={styles.workoutStatItem}>
                  <Ionicons name="flame-outline" size={14} color={Colors.textSecondary} />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4 }]}>{w.calories} kcal</Text>
                </View>
                <View style={styles.workoutStatItem}>
                  <Ionicons name="trending-up-outline" size={14} color={Colors.textSecondary} />
                  <Text style={[Typography.bodySecondary, { marginLeft: 4 }]}>{w.volume.toLocaleString()}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  calendarBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Quick Stats
  quickStats: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  // Quick Actions
  sectionTitle: { marginBottom: 16 },
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

  // Workout Cards
  emptyCard: { alignItems: 'center', padding: 40 },
  workoutCard: { marginBottom: 12, padding: 16 },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  workoutIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  workoutBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  workoutBadgeText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  workoutStats: { flexDirection: 'row', gap: 20, paddingLeft: 52 },
  workoutStatItem: { flexDirection: 'row', alignItems: 'center' },
});
