import React, { useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utility/supabase';
import Container from '../components/Container';
import CustomPressable from '../components/Pressable';
import { styled } from 'nativewind';
import LoadingScreen from '../components/LoadingScreen';

const StyledText = styled(Text);

const BodypartView = ({ session, workoutId }) => {
  const [bodyparts, setBodyparts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
      
      
    };

    fetchBodyparts();
  }, []);

  const handlePress = (bodypartId) => {
    navigation.navigate('ExercisesList', { bodypartId, workoutId });
  };
  if (loading) {
    return <LoadingScreen message="Loading body parts..." />;
  }

  return (
    <Container className="items-center, w-50">
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
