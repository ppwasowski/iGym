import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../utility/supabase';

const PersonalRecords = ({ route }) => {
  const { session } = route.params;
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('personal_records')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;
        setRecords(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecords();
  }, [session.user.id]);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.exercise_name}: {item.record_value} {item.unit}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PersonalRecords;
