import React, { useState } from 'react';
import { Database, Check } from 'lucide-react';
import { initializeDatabase } from '../../scripts/initializeDatabase';
import { useAuth } from '../../context/AuthContext';

const DatabaseInit = () => {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();

  const handleInitialize = async () => {
    setLoading(true);
    const success = await initializeDatabase();
    if (success) {
      localStorage.setItem('dbInitialized', 'true');
      setInitialized(true);
    }
    setLoading(false);
  };

  if (user?.role !== 'admin' || initialized || localStorage.getItem('dbInitialized')) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <Database className="text-blue-600" size={20} />
        <h3 className="font-semibold text-blue-800">Initialize Sample Data</h3>
      </div>
      <p className="text-sm text-blue-700 mb-4">
        Click below to populate the database with sample assets, stock items, and other data to get started.
      </p>
      <button
        onClick={handleInitialize}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>Loading...</>
        ) : (
          <>
            <Check size={16} />
            Initialize Database
          </>
        )}
      </button>
    </div>
  );
};

export default DatabaseInit;