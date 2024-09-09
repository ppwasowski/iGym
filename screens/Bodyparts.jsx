import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
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

  const imageMap = {
    waist: require('../assets/icons/waist.png'),
    upperlegs: require('../assets/icons/upper_legs.png'),
    upperarms: require('../assets/icons/upper_arms.png'),
    shoulders: require('../assets/icons/shoulders.png'),
    neck: require('../assets/icons/neck.png'),
    lowerlegs: require('../assets/icons/lower_legs.png'),
    lowerarms: require('../assets/icons/lower_arms.png'),
    chest: require('../assets/icons/chest.png'),
    cardio: require('../assets/icons/cardio.png'),
    back: require('../assets/icons/back.png'),

  };

  return (
    <Container className="flex-1">
      {error ? (
        <StyledText className="text-red-500">{`Error: ${error}`}</StyledText>
      ) : (
        <FlatList
          data={bodyparts}
          renderItem={({ item }) => (
            <CustomPressable
              onPress={() => handlePress(item.id)}
              title={item.name}
              imageSource={imageMap[item.name.toLowerCase().replace(' ', '')]} // Map image based on item name
              pressableStyle="bg-Secondary h-40 p-4 m-1 items-center rounded-lg w-[47%]"
              textStyle="text-Text text-lg font-bold capitalize"
              imageStyle="w-20 h-20"
              tintColor="#00C87C"
            />
          )}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ alignItems: 'center' }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={{ flexGrow: 1 }}
        />
      )}
    </Container>
  );
};

export default BodypartView;
