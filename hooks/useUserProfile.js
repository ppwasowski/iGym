import { useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

const useUserProfile = (session) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    height: '',
    weight: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select('first_name, last_name, age, height, weight')
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile({
          firstName: data.first_name,
          lastName: data.last_name,
          age: data.age,
          height: data.height,
          weight: data.weight
        });
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName,
          age: updatedProfile.age,
          height: updatedProfile.height,
          weight: updatedProfile.weight,
        })
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }

      setProfile(updatedProfile);
    } catch (error) {
      setError(error.message);
      console.error('Error updating profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
};

export default useUserProfile;
