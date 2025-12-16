import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, MapPin, Wrench, AlertTriangle, ShoppingCart, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'staff'] },
    { icon: Package, label: 'Assets', path: '/assets', roles: ['admin', 'staff'] },
    { icon: Warehouse, label: 'Stock Management', path: '/stock', roles: ['admin'] },
    { icon: BookOpen, label: 'Library', path: '/library', roles: ['admin', 'staff'] },
    { icon: MapPin, label: 'Room Assets', path: '/rooms', roles: ['admin', 'staff'] },
    { icon: Wrench, label: 'Repair History', path: '/repairs', roles: ['admin'] },
    { icon: AlertTriangle, label: 'Low Stock Alerts', path: '/alerts', roles: ['admin', 'staff'] },
    { icon: ShoppingCart, label: 'Purchase Requests', path: '/purchases', roles: ['admin'] }
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed lg:relative lg:translate-x-0
        w-64 h-full bg-primary border-r border-primary flex-shrink-0
        transition-transform duration-300 ease-in-out z-50
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Package className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">School Asset</h1>
              <p className="text-xs text-white/70">Management</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-white text-primary' 
                    : 'text-white hover:bg-white/10'
                  }
                `}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
