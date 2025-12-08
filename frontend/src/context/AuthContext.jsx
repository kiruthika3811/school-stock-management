import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email, password) => {
    const defaultUsers = {
      'admin@school.com': { email: 'admin@school.com', role: 'admin', name: 'Admin User' },
      'manager@school.com': { email: 'manager@school.com', role: 'manager', name: 'Manager User' },
      'staff@school.com': { email: 'staff@school.com', role: 'staff', name: 'Staff User' }
    };

    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    const allUsers = { ...defaultUsers };
    approvedUsers.forEach(u => {
      allUsers[u.email] = u;
    });

    const foundUser = allUsers[email];
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const approveAccessRequest = (requestId, role = 'staff') => {
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const request = accessRequests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      localStorage.setItem('accessRequests', JSON.stringify(accessRequests));

      const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
      approvedUsers.push({
        email: request.email,
        name: request.name,
        role: role
      });
      localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = notifications.filter(n => n.requestId !== requestId);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
  };

  const rejectAccessRequest = (requestId) => {
    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const request = accessRequests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'rejected';
      localStorage.setItem('accessRequests', JSON.stringify(accessRequests));

      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = notifications.filter(n => n.requestId !== requestId);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, approveAccessRequest, rejectAccessRequest }}>
      {children}
    </AuthContext.Provider>
  );
};
