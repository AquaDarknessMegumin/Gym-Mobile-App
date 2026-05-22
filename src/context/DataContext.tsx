import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

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
  const { user } = useContext(AuthContext) || { user: null };
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals>({ calories: 0, workouts: 0, duration: 0, volume: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

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
    if (!user) {
      setWorkouts([]);
      setRoutines([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch Workouts from Supabase
      const { data: dbWorkouts, error: wError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (wError) throw wError;

      const formattedWorkouts: Workout[] = (dbWorkouts || []).map((w: any) => ({
        id: w.id.toString(),
        title: w.title,
        category: w.category,
        duration: w.duration,
        volume: w.volume,
        calories: w.calories,
        date: w.date,
      }));

      // 2. Fetch Routines from Supabase (with nested Exercises)
      const { data: dbRoutines, error: rError } = await supabase
        .from('routines')
        .select(`
          id,
          title,
          description,
          routine_exercises (
            sets_count,
            reps_count,
            order_index,
            exercises (
              id,
              name,
              category
            )
          )
        `)
        .eq('user_id', user.id);

      if (rError) throw rError;

      const formattedRoutines: SavedRoutine[] = (dbRoutines || []).map((r: any) => ({
        id: r.id.toString(),
        title: r.title,
        description: r.description,
        exercises: (r.routine_exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((re: any) => ({
            id: re.exercises.id,
            name: re.exercises.name,
            category: re.exercises.category,
            sets: re.sets_count.toString(),
            reps: re.reps_count.toString(),
          })),
      }));

      setWorkouts(formattedWorkouts);
      setRoutines(formattedRoutines);
    } catch (e) {
      console.error('Failed to load data from Supabase', e);
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'date'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          title: workout.title,
          category: workout.category,
          duration: workout.duration,
          volume: workout.volume,
          calories: workout.calories,
          date: new Date().toISOString(),
        });

      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Failed to add workout to Supabase', e);
      throw e;
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', parseInt(id))
        .eq('user_id', user.id);

      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Failed to delete workout from Supabase', e);
      throw e;
    }
  };

  const addRoutine = async (routine: Omit<SavedRoutine, 'id'>) => {
    if (!user) return;

    try {
      // 1. Insert routine metadata
      const { data: newRoutine, error: rError } = await supabase
        .from('routines')
        .insert({
          user_id: user.id,
          title: routine.title,
          description: routine.description || '',
        })
        .select('id')
        .single();

      if (rError) throw rError;

      // 2. Insert joint routine_exercises records
      if (routine.exercises && routine.exercises.length > 0) {
        const routineId = newRoutine.id;
        const exerciseRecords = routine.exercises.map((ex, index) => ({
          routine_id: routineId,
          exercise_id: ex.id,
          sets_count: parseInt(ex.sets || '3'),
          reps_count: parseInt(ex.reps || '10'),
          order_index: index,
        }));

        const { error: reError } = await supabase
          .from('routine_exercises')
          .insert(exerciseRecords);

        if (reError) throw reError;
      }

      await loadData();
    } catch (e) {
      console.error('Failed to add routine to Supabase', e);
      throw e;
    }
  };

  const updateRoutine = async (id: string, routineUpdates: Partial<SavedRoutine>) => {
    if (!user) return;

    const routineId = parseInt(id);

    try {
      // 1. Update routine metadata
      if (routineUpdates.title !== undefined || routineUpdates.description !== undefined) {
        const { error: rError } = await supabase
          .from('routines')
          .update({
            title: routineUpdates.title,
            description: routineUpdates.description,
          })
          .eq('id', routineId)
          .eq('user_id', user.id);

        if (rError) throw rError;
      }

      // 2. Update exercises mapping if changed
      if (routineUpdates.exercises) {
        // Delete all old exercises inside the routine
        const { error: delError } = await supabase
          .from('routine_exercises')
          .delete()
          .eq('routine_id', routineId);

        if (delError) throw delError;

        // Insert new exercises inside the routine
        if (routineUpdates.exercises.length > 0) {
          const exerciseRecords = routineUpdates.exercises.map((ex, index) => ({
            routine_id: routineId,
            exercise_id: ex.id,
            sets_count: parseInt(ex.sets || '3'),
            reps_count: parseInt(ex.reps || '10'),
            order_index: index,
          }));

          const { error: insError } = await supabase
            .from('routine_exercises')
            .insert(exerciseRecords);

          if (insError) throw insError;
        }
      }

      await loadData();
    } catch (e) {
      console.error('Failed to update routine in Supabase', e);
      throw e;
    }
  };

  const deleteRoutine = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', parseInt(id))
        .eq('user_id', user.id);

      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Failed to delete routine from Supabase', e);
      throw e;
    }
  };

  return (
    <DataContext.Provider value={{ workouts, routines, weeklyGoals, isLoading, addWorkout, deleteWorkout, addRoutine, updateRoutine, deleteRoutine }}>
      {children}
    </DataContext.Provider>
  );
};
