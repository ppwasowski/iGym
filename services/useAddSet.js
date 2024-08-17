import { useState, useContext, useEffect } from 'react';
import { supabase } from '../utility/supabase';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';

const useAddSet = (sessionId, exerciseId, sets, setSets) => {
  const { profile } = useContext(UserContext);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const addSet = async () => {
    // Validate inputs
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Weight',
        text2: 'Please provide a valid weight greater than 0.',
      });
      return false;
    }

    if (isNaN(parsedReps) || parsedReps <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Reps',
        text2: 'Please provide a valid number of reps greater than 0.',
      });
      return false;
    }

    if (!sessionId) {
      Toast.show({
        type: 'error',
        text1: 'Session ID Missing',
        text2: 'No session ID provided. Please ensure you have started a session.',
      });
      return false;
    }

    if (!profile?.id) {
      Toast.show({
        type: 'error',
        text1: 'User Not Logged In',
        text2: 'Please log in to add a set.',
      });
      return false;
    }

    // Calculate the current set number for the exercise
    const currentSetNumber = sets.length + 1;

    const newSet = {
      workout_session_id: sessionId,
      exercise_id: exerciseId,
      sets: currentSetNumber,
      reps: parsedReps,
      weight: parsedWeight,
      completed_at: new Date().toISOString(),
      user_id: profile.id,
    };

    try {
      const { data, error } = await supabase
        .from('workout_progress')
        .insert([newSet])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        Toast.show({
          type: 'success',
          text1: 'Set Added',
          text2: `Set ${currentSetNumber} has been successfully added.`,
        });

        setSets([...sets, { ...newSet, id: data[0].id }]);
        setWeight('');
        setReps('');
        return true;
      } else {
        throw new Error('Set was not added. Please try again.');
      }

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error Adding Set',
        text2: error.message || 'An unexpected error occurred while adding the set.',
      });
      return false;
    }
  };

  return { weight, setWeight, reps, setReps, addSet };
};

export default useAddSet;
