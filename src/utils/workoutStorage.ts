import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoggedInEmail } from "./authStorage";

export type WorkoutData = { totalWorkouts: number; completedDates: string[] };
const keyForUser = (email: string) => `workoutProgress:${email.trim().toLowerCase()}`;
const emptyData = (): WorkoutData => ({ totalWorkouts: 0, completedDates: [] });
const getDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const getUserKey = async () => { const email = await getLoggedInEmail(); return email ? keyForUser(email) : null; };

export const getWorkoutData = async (): Promise<WorkoutData> => {
  try {
    const key = await getUserKey(); if (!key) return emptyData();
    const data = await AsyncStorage.getItem(key); if (!data) return emptyData();
    const value = JSON.parse(data) as Partial<WorkoutData>;
    return { totalWorkouts: typeof value.totalWorkouts === "number" && value.totalWorkouts >= 0 ? value.totalWorkouts : 0, completedDates: Array.isArray(value.completedDates) ? value.completedDates.filter((item): item is string => typeof item === "string") : [] };
  } catch { return emptyData(); }
};

export const completeWorkout = async (): Promise<WorkoutData> => {
  const key = await getUserKey(); if (!key) throw new Error("NOT_AUTHENTICATED");
  const data = await getWorkoutData(); const today = getDateKey(new Date());
  if (!data.completedDates.includes(today)) { data.completedDates = [...data.completedDates, today]; data.totalWorkouts += 1; }
  await AsyncStorage.setItem(key, JSON.stringify(data)); return data;
};
export const isWorkoutCompletedToday = async () => (await getWorkoutData()).completedDates.includes(getDateKey(new Date()));
export const getWorkoutStreak = async () => { const data = await getWorkoutData(); const set = new Set(data.completedDates); const today = new Date(); let streak = 0; for (let i = 0; i < 365; i++) { const date = new Date(today); date.setDate(today.getDate() - i); if (!set.has(getDateKey(date))) break; streak++; } return streak; };
export const getWeeklyWorkoutCounts = async () => { const data = await getWorkoutData(); const counts = Array(7).fill(0) as number[]; const today = new Date(); for (let i = 0; i < 7; i++) { const date = new Date(today); date.setDate(today.getDate() - (6 - i)); if (data.completedDates.includes(getDateKey(date))) counts[i] = 1; } return counts; };
