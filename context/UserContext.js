import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../utility/supabase';

export const UserContext = createContext();

export const UserProvider = ({ children, session }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProfile(session.user.id);
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchProfile = async (userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data || {});
    } catch (error) {
      setError(error.message);
      console.error('Error fetching profile:', error.message);
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
        .eq('id', profileData.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(prevProfile => ({ ...prevProfile, ...data }));
    } catch (error) {
      setError(error.message);
      console.error('Error updating profile:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async (userId) => {
    await fetchProfile(userId);
  };

  return (
    <UserContext.Provider value={{ profile, loading, error, updateProfile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};
