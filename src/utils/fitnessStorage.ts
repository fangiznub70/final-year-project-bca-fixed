import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoggedInEmail } from "./authStorage";

export type FitnessProfile = {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  goal: "lose" | "maintain" | "gain";
  activity: "low" | "moderate" | "high";
};

const keyForUser = (email: string) => `fitnessProfile:${email.trim().toLowerCase()}`;
const getUserKey = async (): Promise<string | null> => {
  const email = await getLoggedInEmail();
  return email ? keyForUser(email) : null;
};
const validNumber = (value: unknown, min: number, max: number) => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

export const saveFitnessProfile = async (profile: FitnessProfile): Promise<void> => {
  const key = await getUserKey();
  if (!key) throw new Error("NOT_AUTHENTICATED");
  if (!validNumber(profile.age, 1, 120) || !validNumber(profile.height, 30, 300) || !validNumber(profile.weight, 1, 500)) throw new Error("INVALID_FITNESS_PROFILE");
  await AsyncStorage.setItem(key, JSON.stringify(profile));
};

export const getFitnessProfile = async (): Promise<FitnessProfile | null> => {
  try {
    const key = await getUserKey();
    if (!key) return null;
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    const value = JSON.parse(data) as Partial<FitnessProfile>;
    if (!validNumber(value.age, 1, 120) || !validNumber(value.height, 30, 300) || !validNumber(value.weight, 1, 500)) return null;
    return value as FitnessProfile;
  } catch (error) {
    console.error("Error reading fitness profile:", error);
    return null;
  }
};

export const deleteFitnessProfile = async (): Promise<void> => {
  const key = await getUserKey();
  if (key) await AsyncStorage.removeItem(key);
};
