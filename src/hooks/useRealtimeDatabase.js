import { useState, useEffect } from 'react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { rtdb } from '../firebase/config';

export const useRealtimeDatabase = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;

    const dbRef = ref(rtdb, path);
    const unsubscribe = onValue(dbRef, 
      (snapshot) => {
        setData(snapshot.val());
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path]);

  const writeData = async (newData) => {
    try {
      await set(ref(rtdb, path), newData);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const pushData = async (newData) => {
    try {
      return await push(ref(rtdb, path), newData);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const updateData = async (updates) => {
    try {
      await update(ref(rtdb, path), updates);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  const deleteData = async () => {
    try {
      await remove(ref(rtdb, path));
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  return {
    data,
    loading,
    error,
    writeData,
    pushData,
    updateData,
    deleteData
  };
};