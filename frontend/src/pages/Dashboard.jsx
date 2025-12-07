import React, { useState } from 'react';
import { Package, Warehouse, Wrench, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [savedData, setSavedData] = useState({
    assets: [],
    stocks: [],
    repairs: [],
    purchases: []
  });

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const addNotification = (title, message, type) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = { id: Date.now(), title, message, time: 'Just now', type, read: false };
    localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));
  };

  const handleSave = () => {
    const timestamp = new Date().toLocaleString();
    if (modalType === 'asset') {
      const newAsset = { id: Date.now(), name: formData.name, category: formData.category, room: formData.room, quantity: formData.quantity, value: formData.quantity ? `$${parseInt(formData.quantity) * 100}` : '$0', status: 'Active', timestamp };
      const existingAssets = JSON.parse(localStorage.getItem('assets') || '[]');
      localStorage.setItem('assets', JSON.stringify([...existingAssets, newAsset]));
      addNotification('New Asset Added', `${formData.name} added to ${formData.room}`, 'info');
      setShowModal(false);
      setFormData({});
      navigate('/assets');
    } else if (modalType === 'stock') {
      const stockUpdate = { id: Date.now(), itemName: formData.itemName, currentStock: formData.currentStock, newStock: formData.newStock, timestamp };
      const existingStocks = JSON.parse(localStorage.getItem('stocks') || '[]');
      localStorage.setItem('stocks', JSON.stringify([...existingStocks, stockUpdate]));
      addNotification('Stock Updated', `${formData.itemName} stock updated`, 'success');
      setShowModal(false);
      setFormData({});
      navigate('/stock');
    } else if (modalType === 'repair') {
      const repairReport = { id: Date.now(), assetName: formData.assetName, issue: formData.issue, location: formData.location, status: 'Pending', timestamp };
      const existingRepairs = JSON.parse(localStorage.getItem('repairs') || '[]');
      localStorage.setItem('repairs', JSON.stringify([...existingRepairs, repairReport]));
      addNotification('Repair Reported', `${formData.assetName} needs repair`, 'warning');
      setShowModal(false);
      setFormData({});
      navigate('/repairs');
    } else if (modalType === 'purchase') {
      const purchaseRequest = { id: Date.now(), itemName: formData.itemName, quantity: formData.quantity, cost: formData.cost, justification: formData.justification, status: 'Pending', timestamp };
      const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      localStorage.setItem('purchases', JSON.stringify([...existingPurchases, purchaseRequest]));
      addNotification('Purchase Request', `${formData.itemName} purchase requested`, 'info');
      setShowModal(false);
      setFormData({});
      navigate('/purchases');
    }
  };

  const stats = [
    { title: 'Total Assets', value: '1,247', icon: Package, trend: 'up', trendValue: '+12%', color: 'primary' },
    { title: 'Stock Items', value: '3,456', icon: Warehouse, trend: 'up', trendValue: '+8%', color: 'success' },
    { title: 'Pending Repairs', value: '23', icon: Wrench, trend: 'down', trendValue: '-5%', color: 'warning' },
    { title: 'Low Stock Alerts', value: '15', icon: AlertTriangle, color: 'danger' }
  ];

  const assetsByCategory = [
    { name: 'Electronics', value: 450, color: '#2563eb' },
    { name: 'Furniture', value: 320, color: '#10b981' },
    { name: 'Sports', value: 180, color: '#f59e0b' },
    { name: 'Lab Equipment', value: 297, color: '#7c3aed' }
  ];

  const monthlyData = [
    { month: 'Jan', assets: 1100, repairs: 45 },
    { month: 'Feb', assets: 1150, repairs: 38 },
    { month: 'Mar', assets: 1180, repairs: 42 },
    { month: 'Apr', assets: 1200, repairs: 35 },
    { month: 'May', assets: 1230, repairs: 28 },
    { month: 'Jun', assets: 1247, repairs: 23 }
  ];

  const recentActivity = [
    { id: 1, action: 'New asset added', item: 'Dell Laptop - Lab 3', time: '5 min ago', type: 'success' },
    { id: 2, action: 'Repair completed', item: 'Projector - Room 201', time: '1 hour ago', type: 'info' },
    { id: 3, action: 'Low stock alert', item: 'Whiteboard Markers', time: '2 hours ago', type: 'warning' },
    { id: 4, action: 'Purchase request', item: 'Chemistry Lab Equipment', time: '3 hours ago', type: 'primary' }
  ];

  const typeColors = {
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-amber-100 text-amber-700',
    primary: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Asset & Repair Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
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
          <h3 className="text-lg font-bold mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${typeColors[activity.type]}`}>
                  <Clock size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => openModal('asset')} className="w-full btn-primary text-left flex items-center gap-3">
              <Package size={20} />
              Add New Asset
            </button>
            <button onClick={() => openModal('stock')} className="w-full bg-success text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-left flex items-center gap-3">
              <Warehouse size={20} />
              Update Stock
            </button>
            <button onClick={() => openModal('repair')} className="w-full bg-warning text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-left flex items-center gap-3">
              <Wrench size={20} />
              Report Repair
            </button>
            <button onClick={() => openModal('purchase')} className="w-full bg-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-left flex items-center gap-3">
              <TrendingUp size={20} />
              Purchase Request
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {modalType === 'asset' && 'Add New Asset'}
              {modalType === 'stock' && 'Update Stock'}
              {modalType === 'repair' && 'Report Repair'}
              {modalType === 'purchase' && 'Purchase Request'}
            </h2>
            
            <div className="space-y-4">
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
                  <input type="text" placeholder="Enter estimated cost (e.g., $5,000)" value={formData.cost || ''} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
                  <textarea placeholder="Enter justification for purchase" value={formData.justification || ''} onChange={(e) => setFormData({...formData, justification: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary">Submit</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
