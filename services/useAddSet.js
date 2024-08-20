import { useState, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const useAddSet = (sessionId, exerciseId, sets, setSets) => {
  const { profile } = useContext(UserContext);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [loading, setLoading] = useState(false);

  const addSet = async () => {
    // Validate inputs
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      console.log('Invalid Weight: Please provide a valid weight greater than 0.');
      return false;
    }

    if (isNaN(parsedReps) || parsedReps <= 0) {
      console.log('Invalid Reps: Please provide a valid number of reps greater than 0.');
      return false;
    }

    if (!sessionId) {
      console.log('Session ID Missing: No session ID provided. Please ensure you have started a session.');
      return false;
    }

    if (!profile?.id) {
      console.log('User Not Logged In: Please log in to add a set.');
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
      setLoading(true);

      const { data, error } = await supabase
        .from('workout_progress')
        .insert([newSet])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setSets([...sets, { ...newSet, id: data[0].id }]);
        setWeight('');
        setReps('');
        return true;
      } else {
        throw new Error('Set was not added. Please try again.');
      }
    } catch (error) {
      console.log('Error Adding Set:', error.message || 'An unexpected error occurred while adding the set.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { weight, setWeight, reps, setReps, addSet, loading };
};

export default useAddSet;
