import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecordTable = ({ items }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>Exercise</Text>
      <Text style={styles.tableHeaderText}>Max Weight (kg)</Text>
      <Text style={styles.tableHeaderText}>Date</Text>
    </View>
    {items.map((item) => (
      <View key={item.exercise_id} style={styles.tableRow}>
        <Text style={styles.tableText}>{item.exercises.name}</Text>
        <Text style={styles.tableText}>{item.weight}</Text>
        <Text style={styles.tableText}>{new Date(item.completed_at).toLocaleDateString()}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    padding: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableText: {
    fontSize: 14,
  },
});

export default RecordTable;
