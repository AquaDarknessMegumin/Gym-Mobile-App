import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { ActiveWorkoutScreen } from '../screens/ActiveWorkoutScreen';
import { ExerciseSelectionScreen } from '../screens/ExerciseSelectionScreen';
import { CreateRoutineScreen } from '../screens/CreateRoutineScreen';

const Stack = createNativeStackNavigator();

export const WorkoutNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutMain" component={WorkoutScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
      <Stack.Screen name="ExerciseSelection" component={ExerciseSelectionScreen} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutineScreen} />
    </Stack.Navigator>
  );
};
