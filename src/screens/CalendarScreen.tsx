import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { DataContext } from '../context/DataContext';
import { Typography } from '../constants/typography';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { AlertModal } from '../components/AlertModal';

export const CalendarScreen = () => {
  const { workouts, deleteWorkout } = useContext(DataContext) || { workouts: [], deleteWorkout: async () => {} };
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (Platform.OS === 'web') {
      setWorkoutToDelete(id);
    } else {
      Alert.alert(
        "Delete Workout",
        "Are you sure you want to delete this workout record?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => deleteWorkout(id) }
        ]
      );
    }
  };

  const confirmDelete = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete);
      setWorkoutToDelete(null);
    }
  };

  const markedDates: any = {};
  workouts.forEach(w => {
    const dateStr = new Date(w.date).toISOString().split('T')[0];
    markedDates[dateStr] = { marked: true, dotColor: Colors.primary };
  });

  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: Colors.primary };
  } else {
    markedDates[selectedDate] = { selected: true, selectedColor: Colors.primary };
  }

  const filteredWorkouts = workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === selectedDate);
  const displayDate = new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]);

  const changeYear = (offset: number) => {
    const d = new Date(currentMonth);
    d.setFullYear(d.getFullYear() + offset);
    setCurrentMonth(d.toISOString().split('T')[0]);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={Typography.header2}>Calendar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.calendarCard}>
          <Calendar
            key={currentMonth}
            current={currentMonth}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            onMonthChange={(month: any) => setCurrentMonth(month.dateString)}
            markedDates={markedDates}
            enableSwipeMonths={true}
            renderHeader={(date: any) => {
              const d = new Date(date);
              const monthName = d.toLocaleDateString(undefined, { month: 'long' });
              const year = d.getFullYear();
              return (
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarMonthText}>{monthName}</Text>
                  <View style={styles.yearNav}>
                    <TouchableOpacity onPress={() => changeYear(-1)} style={styles.yearBtn}>
                      <Ionicons name="chevron-back" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.yearText}>{year}</Text>
                    <TouchableOpacity onPress={() => changeYear(1)} style={styles.yearBtn}>
                      <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: '#d9e1e8',
              dotColor: Colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
              indicatorColor: Colors.primary,
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14
            }}
          />
        </Card>

        <Text style={[Typography.header2, styles.sectionTitle]}>Workouts on {displayDate}</Text>

        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={32} color="#8E8E93" style={{ marginBottom: 8 }} />
            <Text style={[Typography.body, { color: '#8E8E93' }]}>No exercise logged on this date.</Text>
          </View>
        ) : (
          filteredWorkouts.map((w) => (
            <Card key={w.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Ionicons name="barbell-outline" size={20} color={Colors.primary} />
                  <Text style={[Typography.bodySecondary, { marginLeft: 8 }]}>
                    {w.category} Day
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(w.id)} style={styles.deleteIconBtn}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <Text style={Typography.header2}>{w.title}</Text>
              <View style={styles.statsRow}>
                <Text style={Typography.bodySecondary}>{w.duration} mins</Text>
                <Text style={Typography.bodySecondary}>•</Text>
                <Text style={Typography.bodySecondary}>{w.calories} kcal</Text>
              </View>
            </Card>
          ))
        )}

      </ScrollView>

      <AlertModal
        visible={!!workoutToDelete}
        title="Delete Workout"
        message="Are you sure you want to delete this workout record?"
        type="delete"
        confirmText="Delete"
        onClose={() => setWorkoutToDelete(null)}
        onConfirm={confirmDelete}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, backgroundColor: '#FAFAFC' },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: { padding: 16, paddingBottom: 40 },
  calendarCard: { padding: 0, overflow: 'hidden', marginBottom: 24 },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '100%',
  },
  calendarMonthText: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  yearNav: { flexDirection: 'row', alignItems: 'center' },
  yearBtn: { padding: 8 },
  yearText: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginHorizontal: 4 },
  sectionTitle: { marginBottom: 16 },
  historyCard: { marginBottom: 12 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  deleteIconBtn: { padding: 4, backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: 12 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  emptyState: { paddingVertical: 24, alignItems: 'center', backgroundColor: 'rgba(142, 142, 147, 0.1)', borderRadius: 12 },
});