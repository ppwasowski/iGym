import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';

const BodypartView = ({ session, workoutId }) => {
  const [bodyparts, setBodyparts] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBodyparts = async () => {
      try {
        const { data, error } = await supabase.from('bodypart').select('*');
        if (error) {
          throw error;
        } else {
          setBodyparts(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBodyparts();
  }, []);

  const handlePress = (bodypartId) => {
    const handlePress = (bodypartId) => {
      console.log('Navigating to ExercisesList with bodypartId:', bodypartId, 'and workoutId:', workoutId);
      navigation.navigate('ExercisesList', { bodypartId, workoutId });
    };
    
    navigation.navigate('ExercisesList', { bodypartId, workoutId });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={bodyparts}
          renderItem={({ item }) => (
            <Pressable
              style={{
                backgroundColor: 'white',
                height: 100,
                width: 190,
                margin: 1,
                marginTop: 10,
                marginRight: 5,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 1,
              }}
              onPress={() => handlePress(item.id)}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' }}>{item.name}</Text>
            </Pressable>
          )}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

export default BodypartView;
