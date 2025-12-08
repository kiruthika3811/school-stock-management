import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, MapPin, Wrench, AlertTriangle, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'manager', 'staff'] },
    { icon: Package, label: 'Assets', path: '/assets', roles: ['admin', 'manager', 'staff'] },
    { icon: Warehouse, label: 'Stock Management', path: '/stock', roles: ['admin', 'manager'] },
    { icon: MapPin, label: 'Room Assets', path: '/rooms', roles: ['admin', 'manager', 'staff'] },
    { icon: Wrench, label: 'Repair History', path: '/repairs', roles: ['admin', 'manager'] },
    { icon: AlertTriangle, label: 'Low Stock Alerts', path: '/alerts', roles: ['admin', 'manager', 'staff'] },
    { icon: ShoppingCart, label: 'Purchase Requests', path: '/purchases', roles: ['admin', 'manager'] }
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
        fixed top-0 left-0 h-full bg-primary border-r border-primary z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
        w-64
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
