import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Workout = {
  id: string;
  title: string;
  category: string;
  duration: number; // in minutes
  volume: number; // in kg
  calories: number;
  date: string;
};

export type WeeklyGoals = {
  calories: number;
  workouts: number;
  duration: number; // in minutes
  volume: number;
};

export type SavedRoutine = {
  id: string;
  title: string;
  description: string;
  exercises: any[]; // The selected exercises
};

type DataContextType = {
  workouts: Workout[];
  routines: SavedRoutine[];
  weeklyGoals: WeeklyGoals;
  isLoading: boolean;
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addRoutine: (routine: Omit<SavedRoutine, 'id'>) => Promise<void>;
  updateRoutine: (id: string, routine: Partial<SavedRoutine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals>({ calories: 0, workouts: 0, duration: 0, volume: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect and loadData logic)

  const updateRoutine = async (id: string, routineUpdates: Partial<SavedRoutine>) => {
    const updatedRoutines = routines.map(r => 
      r.id === id ? { ...r, ...routineUpdates } : r
    );
    setRoutines(updatedRoutines);
    await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateWeeklyGoals(workouts);
  }, [workouts]);

  const calculateWeeklyGoals = (currentWorkouts: Workout[]) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let calories = 0;
    let workoutCount = 0;
    let duration = 0;
    let volume = 0;

    currentWorkouts.forEach(w => {
      const workoutDate = new Date(w.date);
      if (workoutDate >= oneWeekAgo) {
        calories += w.calories || 0;
        workoutCount += 1;
        duration += w.duration || 0;
        volume += w.volume || 0;
      }
    });

    setWeeklyGoals({ calories, workouts: workoutCount, duration, volume });
  };

  const loadData = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts_v2');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      } else {
        const dummyData: Workout[] = [
          { id: 'w1', title: 'Push Day', category: 'Push', duration: 45, volume: 5500, calories: 375, date: new Date().toISOString() },
        ];
        setWorkouts(dummyData);
        await AsyncStorage.setItem('workouts_v2', JSON.stringify(dummyData));
      }

      const storedRoutines = await AsyncStorage.getItem('routines');
      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      } else {
        const defaultRoutines: SavedRoutine[] = [
          { id: 'r1', title: 'Push routine', description: 'Warm up, bench press, incline bench press, seated shoulder press, chest fly, tricep pushdown', exercises: [] },
          { id: 'r2', title: 'Pull routine', description: 'Warm up, pull-ups, barbell rows, lat pulldowns, face pulls, bicep curls', exercises: [] },
          { id: 'r3', title: 'Legs routine', description: 'Warm up, squat, split squats, Romanian deadlift, calf raises', exercises: [] }
        ];
        setRoutines(defaultRoutines);
        await AsyncStorage.setItem('routines', JSON.stringify(defaultRoutines));
      }
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'date'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    const updatedWorkouts = [newWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('workouts_v2', JSON.stringify(updatedWorkouts));
  };

  const deleteWorkout = async (id: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
    await AsyncStorage.setItem('workouts_v2', JSON.stringify(updatedWorkouts));
  };

  const addRoutine = async (routine: Omit<SavedRoutine, 'id'>) => {
    const newRoutine: SavedRoutine = {
      ...routine,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedRoutines = [newRoutine, ...routines];
    setRoutines(updatedRoutines);
    await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
  };

  const deleteRoutine = async (id: string) => {
    const updatedRoutines = routines.filter(r => r.id !== id);
    setRoutines(updatedRoutines);
    await AsyncStorage.setItem('routines', JSON.stringify(updatedRoutines));
  };

  return (
    <DataContext.Provider value={{ workouts, routines, weeklyGoals, isLoading, addWorkout, deleteWorkout, addRoutine, updateRoutine, deleteRoutine }}>
      {children}
    </DataContext.Provider>
  );
};
