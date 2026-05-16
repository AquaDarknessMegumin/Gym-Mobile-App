import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = ({ navigation }: any) => {
  const { workouts, weeklyGoals } = useContext(DataContext) || { 
    workouts: [], 
    weeklyGoals: { calories: 0, workouts: 0, duration: 0, volume: 0 } 
  };
  const { user } = useContext(AuthContext) || { user: null };
  const username = user?.username || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  const [activeTab, setActiveTab] = useState<'duration' | 'volume' | 'calories'>('duration');

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayWorkouts = workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === dateStr);
      
      let value = 0;
      dayWorkouts.forEach(w => {
        if (activeTab === 'duration') value += w.duration || 0;
        else if (activeTab === 'volume') value += w.volume || 0;
        else value += w.calories || 0;
      });

      days.push({
        label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3),
        value,
        isToday: i === 0,
      });
    }
    return days;
  };

  const chartData = getLast7Days();
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${hrs}h ${m}m` : `${hrs}h`;
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={Typography.header2}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsBtn} 
          onPress={() => navigation.navigate('SettingsStack')}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.username}>{username}</Text>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => navigation.navigate('SettingsStack')}
            >
              <Ionicons name="pencil-outline" size={14} color="#fff" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.profileStatItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(99,56,171,0.1)' }]}>
                <Ionicons name="barbell-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.profileStatValue}>{totalWorkouts}</Text>
              <Text style={styles.profileStatLabel}>Workouts</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStatItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                <Ionicons name="time-outline" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.profileStatValue}>{formatDuration(totalDuration)}</Text>
              <Text style={styles.profileStatLabel}>Total Time</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStatItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                <Ionicons name="flame-outline" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.profileStatValue}>{totalCalories.toLocaleString()}</Text>
              <Text style={styles.profileStatLabel}>Calories</Text>
            </View>
          </View>
        </Card>

        {/* Weekly Chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={Typography.header2}>This Week</Text>
            <Text style={[Typography.bodySecondary, { fontSize: 12 }]}>
              {weeklyGoals.workouts} workout{weeklyGoals.workouts !== 1 ? 's' : ''} this week
            </Text>
          </View>

          <View style={styles.tabsContainer}>
            {(['duration', 'volume', 'calories'] as const).map((tab) => (
              <TouchableOpacity 
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={activeTab === tab ? styles.tabTextActive : styles.tabTextInactive}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.chartContainer}>
            {chartData.map((day, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barWrapper}>
                  <View style={[
                    styles.bar, 
                    { 
                      height: `${Math.max((day.value / maxValue) * 100, day.value > 0 ? 8 : 3)}%`,
                      backgroundColor: day.isToday ? Colors.primary : 'rgba(99,56,171,0.25)',
                    }
                  ]} />
                </View>
                <Text style={[styles.barLabel, day.isToday && { color: Colors.primary, fontWeight: 'bold' }]}>
                  {day.label}
                </Text>
                {day.value > 0 && (
                  <Text style={styles.barValue}>
                    {activeTab === 'duration' ? `${day.value}m` : day.value.toLocaleString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Workout History */}
        <Text style={[Typography.header2, styles.sectionTitle]}>Workout History</Text>
        
        {workouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="fitness-outline" size={48} color="#E5E5EA" />
            <Text style={[Typography.bodySecondary, { marginTop: 12 }]}>No workout history yet.</Text>
          </Card>
        ) : (
          workouts.slice(0, 5).map((w) => (
            <Card key={w.id} style={styles.historyItem}>
              <View style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Ionicons name="barbell" size={18} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.body, { fontWeight: '600' }]}>{w.title}</Text>
                  <Text style={[Typography.bodySecondary, { fontSize: 12 }]}>
                    {new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {w.duration}min • {w.calories} kcal
                  </Text>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Profile Card
  profileCard: { padding: 24, marginBottom: 16, alignItems: 'center' },
  profileTop: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  username: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  editBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  editBtnText: { fontSize: 13, color: '#fff', fontWeight: '600', marginLeft: 4 },
  profileStats: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  profileStatItem: { alignItems: 'center' },
  statIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  profileStatValue: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  profileStatLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  profileStatDivider: { width: 1, height: 40, backgroundColor: Colors.border, marginTop: 20 },

  // Chart Card
  chartCard: { padding: 20, marginBottom: 24 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tabsContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F2F2F7', 
    borderRadius: 10, 
    padding: 3, 
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { 
    backgroundColor: Colors.surface, 
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabTextActive: { fontWeight: '600', color: Colors.text, fontSize: 13 },
  tabTextInactive: { color: Colors.textSecondary, fontSize: 13 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 140 },
  barColumn: { flex: 1, alignItems: 'center' },
  barWrapper: { flex: 1, width: '60%', justifyContent: 'flex-end', marginBottom: 6 },
  bar: { width: '100%', borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 11, color: Colors.textSecondary },
  barValue: { fontSize: 9, color: Colors.textSecondary, marginTop: 2 },

  // History
  sectionTitle: { marginBottom: 16 },
  emptyCard: { alignItems: 'center', padding: 40 },
  historyItem: { marginBottom: 8, padding: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
});