import { useState, useEffect } from 'react';
import databaseService from '../services/databaseService';

export const useFirebaseData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    try {
      switch (dataType) {
        case 'assets':
          unsubscribe = databaseService.subscribeToAssets((assets) => {
            setData(assets);
            setLoading(false);
          });
          break;
        case 'stock':
          unsubscribe = databaseService.subscribeToStock((stock) => {
            setData(stock);
            setLoading(false);
          });
          break;
        case 'repairs':
          unsubscribe = databaseService.subscribeToRepairs((repairs) => {
            setData(repairs);
            setLoading(false);
          });
          break;
        case 'purchases':
          unsubscribe = databaseService.subscribeToPurchases((purchases) => {
            setData(purchases);
            setLoading(false);
          });
          break;
        case 'notifications':
          unsubscribe = databaseService.subscribeToNotifications((notifications) => {
            setData(notifications);
            setLoading(false);
          });
          break;
        default:
          setError(new Error(`Unknown data type: ${dataType}`));
          setLoading(false);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dataType]);

  return { data, loading, error };
};

export const useStats = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    stockItems: 0,
    pendingRepairs: 0,
    lowStockAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = databaseService.subscribeToStats((newStats) => {
      setStats(newStats);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { stats, loading };
};