import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getLoggedInUser } from "../utils/authStorage";
import { getFitnessProfile } from "../utils/fitnessStorage";

export default function Index() {
  useEffect(() => { let active = true; (async () => { const user = await getLoggedInUser(); if (!active) return; if (!user) { router.replace("/welcome"); return; } const profile = await getFitnessProfile(); if (active) router.replace(profile ? "/home" : "/onboarding"); })(); return () => { active = false; }; }, []);
  return <View style={styles.container}><ActivityIndicator size="large" color="#5B5BD6" /></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#F7F8FC", justifyContent: "center", alignItems: "center" } });
