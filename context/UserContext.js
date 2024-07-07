import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

export const UserContext = createContext();

export const UserProvider = ({ children, session }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      // Merge the updated fields into the current profile
      setProfile(prevProfile => ({ ...prevProfile, ...data }));
    } catch (error) {
      setError(error.message);
      throw error; // rethrow the error to be caught in the component
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
