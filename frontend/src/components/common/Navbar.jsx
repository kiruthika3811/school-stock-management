import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, User, LogOut, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const navigate = useNavigate();
  const { user, logout, approveAccessRequest, rejectAccessRequest } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const loadNotifications = () => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filteredNotifications = user?.role === 'admin' 
      ? storedNotifications 
      : storedNotifications.filter(n => n.type !== 'access_request');
    setNotifications(filteredNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const handleApprove = (requestId) => {
    const role = selectedRole[requestId] || 'staff';
    approveAccessRequest(requestId, role);
    loadNotifications();
  };

  const handleReject = (requestId) => {
    rejectAccessRequest(requestId);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assets, rooms, or items..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllAsRead(); }} className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <Bell size={22} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-4 border-b border-gray-100">
                        <p className="font-medium text-sm">{notif.title}</p>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        
                        {notif.type === 'access_request' && user?.role === 'admin' && (
                          <div className="mt-3 space-y-2">
                            <select
                              value={selectedRole[notif.requestId] || 'staff'}
                              onChange={(e) => setSelectedRole({...selectedRole, [notif.requestId]: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                              <option value="staff">Staff</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(notif.requestId)}
                                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                              >
                                <Check size={16} /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(notif.requestId)}
                                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-1"
                              >
                                <X size={16} /> Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button onClick={() => { navigate('/alerts'); setShowNotifications(false); }} className="text-primary text-sm font-medium">View All</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium whitespace-nowrap">{user?.name}</p>
              <p className="text-xs text-gray-500 whitespace-nowrap capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="text-white" size={20} />
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
