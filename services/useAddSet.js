import { useState, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useAddSet = (sessionId, exerciseId, sets, setSets, setAlertMessage, setAlertVisible) => {
  const { profile } = useContext(UserContext);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [loading, setLoading] = useState(false);

  const addSet = async () => {
    // Validate inputs
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setAlertMessage('Please provide a valid weight greater than 0.');
      setAlertVisible(true);
      return false;
    }

    if (isNaN(parsedReps) || parsedReps <= 0) {
      setAlertMessage('Please provide a valid number of reps greater than 0.');
      setAlertVisible(true);
      return false;
    }

    if (!sessionId) {
      setAlertMessage('No session ID provided. Please ensure you have started a session.');
      setAlertVisible(true);
      return false;
    }

    if (!profile?.id) {
      setAlertMessage('Please log in to add a set.');
      setAlertVisible(true);
      return false;
    }

    // Calculate the current set number for the exercise
    const currentSetNumber = sets.filter(set => set.exercise_id === exerciseId).length + 1;

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
      setLoading(true);

      const { data, error } = await supabase
        .from('workout_progress')
        .insert([newSet])
        .select();

      if (error) {
        setAlertMessage('Error: Failed to add the set.');
        setAlertVisible(true);
        return false;
      }

      if (data && data.length > 0) {
        // Update the local state with the new set
        setSets([...sets, { ...newSet, id: data[0].id }]);
        setWeight('');
        setReps('');
        return true;
      } else {
        setAlertMessage('Set was not added. Please try again.');
        setAlertVisible(true);
        return false;
      }
    } catch (error) {
      setAlertMessage('Error: ' + (error.message || 'An unexpected error occurred while adding the set.'));
      setAlertVisible(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { weight, setWeight, reps, setReps, addSet, loading };
};

export default useAddSet;
