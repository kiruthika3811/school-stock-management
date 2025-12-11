import React, { useState } from 'react';
import { Package, Warehouse, Wrench, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import AdminPanel from '../components/admin/AdminPanel';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStats, useFirebaseData } from '../hooks/useFirebaseData';
import databaseService from '../services/databaseService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const { stats, loading: statsLoading } = useStats();
  const { data: recentActivity } = useFirebaseData('notifications');

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const addNotification = async (title, message, type) => {
    await databaseService.addNotification({
      title,
      message,
      type,
      time: 'Just now'
    });
  };

  const handleSave = async () => {
    try {
      if (modalType === 'asset') {
        await databaseService.addAsset({
          name: formData.name,
          category: formData.category,
          room: formData.room,
          quantity: parseInt(formData.quantity) || 1,
          value: formData.quantity ? `${parseInt(formData.quantity) * 100}` : '0'
        });
        await addNotification('New Asset Added', `${formData.name} added to ${formData.room}`, 'success');
        navigate('/assets');
      } else if (modalType === 'stock') {
        await databaseService.addStockItem({
          itemName: formData.itemName,
          category: formData.category,
          currentStock: parseInt(formData.currentStock) || 0,
          newStock: parseInt(formData.newStock) || 0,
          minStock: 10
        });
        await addNotification('Stock Updated', `${formData.itemName} stock updated`, 'success');
        navigate('/stock');
      } else if (modalType === 'repair') {
        await databaseService.addRepair({
          assetName: formData.assetName,
          issue: formData.issue,
          location: formData.location
        });
        await addNotification('Repair Reported', `${formData.assetName} needs repair`, 'warning');
        navigate('/repairs');
      } else if (modalType === 'purchase') {
        await databaseService.addPurchaseRequest({
          itemName: formData.itemName,
          quantity: parseInt(formData.quantity) || 1,
          cost: formData.cost,
          justification: formData.justification
        });
        await addNotification('Purchase Request', `${formData.itemName} purchase requested`, 'info');
        navigate('/purchases');
      }
      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const statsCards = [
    { title: 'Total Assets', value: stats.totalAssets.toString(), icon: Package, trend: 'up', trendValue: '+12%', color: 'primary' },
    { title: 'Stock Items', value: stats.stockItems.toString(), icon: Warehouse, trend: 'up', trendValue: '+8%', color: 'success' },
    { title: 'Pending Repairs', value: stats.pendingRepairs.toString(), icon: Wrench, trend: 'down', trendValue: '-5%', color: 'warning' },
    { title: 'Low Stock Alerts', value: stats.lowStockAlerts.toString(), icon: AlertTriangle, color: 'danger' }
  ];

  const { data: assets } = useFirebaseData('assets');
  const { data: repairs } = useFirebaseData('repairs');

  const assetsByCategory = React.useMemo(() => {
    const categories = {};
    assets.forEach(asset => {
      const category = asset.category || 'Other';
      categories[category] = (categories[category] || 0) + (asset.quantity || 1);
    });
    
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#06b6d4'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [assets]);

  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      assets: assets.length,
      repairs: repairs.filter(r => r.status === 'Pending').length
    }));
  }, [assets, repairs]);

  const activityItems = recentActivity.slice(0, 4).map(notification => ({
    id: notification.id,
    action: notification.title,
    item: notification.message,
    time: notification.time || 'Recently',
    type: notification.type || 'info'
  }));

  const typeColors = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-amber-100 text-amber-700',
    primary: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statsLoading ? (
          <div className="col-span-full text-center py-8">Loading statistics...</div>
        ) : (
          statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>


      <AdminPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="card">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Asset & Repair Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assets" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="repairs" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assetsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold">Recent Activity</h3>
            <button className="text-primary text-xs sm:text-sm font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {activityItems.length > 0 ? (
              activityItems.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${typeColors[activity.type]} flex-shrink-0`}>
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs sm:text-sm">{activity.action}</p>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No recent activity</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            <button onClick={() => openModal('asset')} className="w-full btn-primary text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <Package size={18} className="flex-shrink-0" />
              <span>Add New Asset</span>
            </button>
            <button onClick={() => openModal('stock')} className="w-full bg-success text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <Warehouse size={18} className="flex-shrink-0" />
              <span>Update Stock</span>
            </button>
            <button onClick={() => openModal('repair')} className="w-full bg-warning text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <Wrench size={18} className="flex-shrink-0" />
              <span>Report Repair</span>
            </button>
            <button onClick={() => openModal('purchase')} className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <TrendingUp size={18} className="flex-shrink-0" />
              <span>Purchase Request</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              {modalType === 'asset' && 'Add New Asset'}
              {modalType === 'stock' && 'Update Stock'}
              {modalType === 'repair' && 'Report Repair'}
              {modalType === 'purchase' && 'Purchase Request'}
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {modalType === 'asset' && (
                <>
                  <input type="text" placeholder="Enter asset name (e.g., Dell Laptop)" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Enter category (e.g., Electronics)" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Enter room (e.g., Lab 3)" value={formData.room || ''} onChange={(e) => setFormData({...formData, room: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="number" placeholder="Enter quantity" value={formData.quantity || ''} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </>
              )}
              
              {modalType === 'stock' && (
                <>
                  <input type="text" placeholder="Enter item name" value={formData.itemName || ''} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Enter category (e.g., Electronics, Furniture)" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="number" placeholder="Enter current stock level" value={formData.currentStock || ''} onChange={(e) => setFormData({...formData, currentStock: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="number" placeholder="Enter new stock level" value={formData.newStock || ''} onChange={(e) => setFormData({...formData, newStock: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </>
              )}
              
              {modalType === 'repair' && (
                <>
                  <input type="text" placeholder="Enter asset name" value={formData.assetName || ''} onChange={(e) => setFormData({...formData, assetName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Describe the issue" value={formData.issue || ''} onChange={(e) => setFormData({...formData, issue: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Enter room location" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                </>
              )}
              
              {modalType === 'purchase' && (
                <>
                  <input type="text" placeholder="Enter item name" value={formData.itemName || ''} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="number" placeholder="Enter quantity needed" value={formData.quantity || ''} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Enter estimated cost (e.g., 5000)" value={formData.cost || ''} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <textarea placeholder="Enter justification for purchase" value={formData.justification || ''} onChange={(e) => setFormData({...formData, justification: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
                </>
              )}
            </div>
            
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary text-sm sm:text-base">Submit</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary text-sm sm:text-base">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
