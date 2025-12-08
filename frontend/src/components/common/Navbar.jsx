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

  const handleLogout = async () => {
    await logout();
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

  const handleApprove = async (requestId) => {
    const role = selectedRole[requestId] || 'staff';
    await approveAccessRequest(requestId, role);
    loadNotifications();
  };

  const handleReject = (requestId) => {
    rejectAccessRequest(requestId);
    loadNotifications();
  };

  const handleDismiss = (notifId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notifId);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-panel') && !event.target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assets, rooms, or items..."
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllAsRead(); }} className="notification-button relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>}
            </button>
            
            {showNotifications && (
              <div className="notification-panel fixed sm:absolute right-0 sm:right-0 left-0 sm:left-auto top-full sm:mt-2 sm:w-80 w-screen bg-white sm:rounded-lg shadow-lg border-t sm:border border-gray-200 z-50 max-h-[80vh] sm:max-h-96 overflow-y-auto">
                <div className="p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white">
                  <h3 className="font-bold text-base sm:text-lg">Notifications</h3>
                </div>
                <div>
                  {notifications.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center text-gray-500">
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3 sm:p-4 border-b border-gray-100 relative">
                        <button
                          onClick={() => handleDismiss(notif.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                        <p className="font-medium text-sm pr-6">{notif.title}</p>
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
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium whitespace-nowrap hidden md:block">{user?.name}</p>
              <p className="text-xs text-gray-500 whitespace-nowrap capitalize">{user?.role}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="text-white" size={18} />
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
