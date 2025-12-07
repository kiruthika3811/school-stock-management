import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Whiteboard Markers running low', time: '5 min ago', type: 'warning' },
    { id: 2, title: 'Repair Completed', message: 'Projector in Room 201 fixed', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'New Asset Added', message: 'Dell Laptop added to Lab 3', time: '2 hours ago', type: 'info' }
  ];

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
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button onClick={() => { navigate('/alerts'); setShowNotifications(false); }} className="text-primary text-sm font-medium">View All</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium whitespace-nowrap">Admin User</p>
              <p className="text-xs text-gray-500 whitespace-nowrap">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="text-white" size={20} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
