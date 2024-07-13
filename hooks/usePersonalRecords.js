import { useEffect, useState, useContext } from 'react';
import { supabase } from '../utility/supabase';
import { UserContext } from '../context/UserContext';

const usePersonalRecords = () => {
  const { profile } = useContext(UserContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalRecords = async () => {
      if (!profile) {
        console.log('No user context found');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching personal records for user ID:', profile.id);
        const { data, error } = await supabase
          .from('workout_progress')
          .select(`
            exercise_id,
            weight,
            completed_at,
            exercises (
              id,
              name
            )
          `)
          .eq('user_id', profile.id);

        if (error) {
          throw error;
        }

        console.log('Fetched workout progress data:', data);
        const maxWeightRecords = data.reduce((acc, record) => {
          const existingRecord = acc.find(r => r.exercise_id === record.exercise_id);
          if (!existingRecord || record.weight > existingRecord.weight) {
            acc = acc.filter(r => r.exercise_id !== record.exercise_id);
            acc.push(record);
          }
          return acc;
        }, []);

        maxWeightRecords.sort((a, b) => b.weight - a.weight);

        console.log('Max weight records:', maxWeightRecords);
        setRecords(maxWeightRecords);
      } catch (error) {
        console.error('Error fetching personal records:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalRecords();
  }, [profile]);

  return { records, loading, error };
};

export default usePersonalRecords;
