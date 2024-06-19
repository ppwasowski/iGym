import { useState } from 'react';

const useAddSet = (sets, setSets) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const addSet = () => {
    if (weight !== '' && reps !== '') {
      const newSet = {
        setNumber: sets.length + 1,
        weight: parseFloat(weight),
        reps: parseInt(reps),
      };
      setSets([...sets, newSet]);
      setWeight('');
      setReps('');
    }
  };

  return {
    weight,
    setWeight,
    reps,
    setReps,
    addSet
  };
};

export default useAddSet;
