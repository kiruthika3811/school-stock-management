import React, { useState } from 'react';
import databaseService from '../services/databaseService';

const UserForm = ({ onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    schoolId: initialData?.schoolId || '',
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'staff',
    profilePhoto: initialData?.profilePhoto || '',
    fcmTokens: initialData?.fcmTokens || []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (initialData) {
        await databaseService.updateUser(initialData.firebaseId, formData);
      } else {
        await databaseService.addUser(formData);
      }
      onSuccess?.();
      if (!initialData) {
        setFormData({
          schoolId: '',
          name: '',
          email: '',
          phone: '',
          role: 'staff',
          profilePhoto: '',
          fcmTokens: []
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit User' : 'Add New User'}</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">School ID</label>
        <input
          type="text"
          value={formData.schoolId}
          onChange={(e) => setFormData({...formData, schoolId: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
        <input
          type="url"
          value={formData.profilePhoto}
          onChange={(e) => setFormData({...formData, profilePhoto: e.target.value})}
          className="w-full p-2 border rounded"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : (initialData ? 'Update User' : 'Add User')}
      </button>
    </form>
  );
};

export default UserForm;