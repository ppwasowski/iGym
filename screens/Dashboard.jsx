import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { UserContext } from '../context/UserContext';
import useWorkoutSessions from '../hooks/useWorkoutSessions';
import getWorkoutMessage from '../components/getWorkoutMessage';

export default function HomeScreen() {
  const { profile, loading: profileLoading, error: profileError } = useContext(UserContext);
  const { sessions, loading: sessionsLoading, error: sessionsError } = useWorkoutSessions();

  if (profileLoading || sessionsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (profileError) {
    return <Text>Error: {profileError}</Text>;
  }

  if (sessionsError) {
    return <Text>Error: {sessionsError}</Text>;
  }

  const lastWorkoutDate = sessions.length > 0 ? sessions[0].session_date : null;
  const message = lastWorkoutDate ? getWorkoutMessage(lastWorkoutDate) : "You haven't started a workout yet.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, {profile.first_name || 'Guest'}!</Text>
      <Text style={styles.quote}>
        “I never dreamed about success. I worked for it.” —Estée Lauder
      </Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.optionsContainer}>
        <Text style={styles.option}>Last workout</Text>
        <Text style={styles.option}>Graphs</Text>
        <Button title="Log" onPress={() => console.log(profile)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: 'green',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  option: {
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
});
