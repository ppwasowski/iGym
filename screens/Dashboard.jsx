import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../utility/supabase';
import useUserProfile from '../hooks/useUserProfile';

export default function HomeScreen({ session }) {
  
  const { profile, loading, error } = useUserProfile(session);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, {profile.firstName || 'Guest'}!</Text>
      <Text style={styles.quote}>
        “I never dreamed about success. I worked for it.” —Estée Lauder
      </Text>
      <View style={styles.optionsContainer}>
        <Text style={styles.option}>Last workout</Text>
        <Text style={styles.option}>Graphs</Text>
        <Button title="log" onPress={() => console.log(session.user)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
