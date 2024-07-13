// useExerciseDetails.js
import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useExerciseDetails = (exerciseId) => {
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('id', exerciseId)
          .single();
        if (error) {
          throw error;
        }
        setExerciseDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetails();
  }, [exerciseId]);

  return { exerciseDetails, loading, error };
};

export default useExerciseDetails;
