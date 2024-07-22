import React, { useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';
import Container from '../components/Container';
import CustomPressable from '../components/Pressable'; // Import the new Pressable component
import { styled } from 'nativewind';

const StyledText = styled(Text);

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
    console.log('Navigating to ExercisesList with bodypartId:', bodypartId, 'and workoutId:', workoutId);
    navigation.navigate('ExercisesList', { bodypartId, workoutId });
  };

  return (
    <Container className="items-center">
      {error ? (
        <StyledText className="text-red-500">{`Error: ${error}`}</StyledText>
      ) : (
        <FlatList
          data={bodyparts}
          renderItem={({ item }) => (
            <CustomPressable
              onPress={() => handlePress(item.id)}
              title={item.name}
            />
          )}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      )}
    </Container>
  );
};

export default BodypartView;
