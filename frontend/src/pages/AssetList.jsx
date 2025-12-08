import React, { useState } from 'react';
import { Plus, Filter, Edit, Trash2 } from 'lucide-react';

const AssetList = () => {

  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteHistory, setDeleteHistory] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', room: '', status: 'Active', quantity: 0, value: '' });
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [statusFilter, setStatusFilter] = useState('all');
  
  const defaultAssets = [
    { id: 1, name: 'Dell Laptop', category: 'Electronics', room: 'Lab 3', status: 'Active', quantity: 25, value: '$25,000' },
    { id: 2, name: 'Projector', category: 'Electronics', room: 'Room 201', status: 'Repair', quantity: 1, value: '$1,200' },
    { id: 3, name: 'Desk Chair', category: 'Furniture', room: 'Office', status: 'Active', quantity: 50, value: '$5,000' },
    { id: 4, name: 'Microscope', category: 'Lab Equipment', room: 'Science Lab', status: 'Active', quantity: 15, value: '$18,000' },
    { id: 5, name: 'Whiteboard', category: 'Furniture', room: 'Room 105', status: 'Active', quantity: 30, value: '$3,000' },
    { id: 6, name: 'Basketball', category: 'Sports', room: 'Gym', status: 'Active', quantity: 20, value: '$600' }
  ];

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('assets');
    return saved ? JSON.parse(saved) : defaultAssets;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const deletedAsset = assets.find(asset => asset.id === id);
      setDeleteHistory([...deleteHistory, { ...deletedAsset, deletedAt: new Date().toLocaleString() }]);
      const updatedAssets = assets.filter(asset => asset.id !== id);
      setAssets(updatedAssets);
      localStorage.setItem('assets', JSON.stringify(updatedAssets));
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSave = () => {
    let updatedAssets;
    if (editingAsset) {
      updatedAssets = assets.map(a => a.id === editingAsset.id ? editingAsset : a);
    } else {
      updatedAssets = [...assets, { ...newAsset, id: Date.now() }];
      setNewAsset({ name: '', category: '', room: '', status: 'Active', quantity: 0, value: '' });
    }
    setAssets(updatedAssets);
    localStorage.setItem('assets', JSON.stringify(updatedAssets));
    setShowModal(false);
    setEditingAsset(null);
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = filters.category === 'All' || asset.category === filters.category;
    const matchesStatus = filters.status === 'All' || asset.status === filters.status;
    const matchesStatusFilter = statusFilter === 'all' || asset.status === statusFilter;
    return matchesCategory && matchesStatus && matchesStatusFilter;
  });

  const statusColors = {
    Active: 'badge-success',
    Repair: 'badge-warning',
    Retired: 'badge-danger'
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Asset Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage and track all school assets</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap">
          <Plus size={18} />
          Add New Asset
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setStatusFilter('all')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        <button onClick={() => setStatusFilter('Active')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${statusFilter === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Active
        </button>
        <button onClick={() => setStatusFilter('Repair')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${statusFilter === 'Repair' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Repair
        </button>
        <button onClick={() => setStatusFilter('Retired')} className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap ${statusFilter === 'Retired' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Retired
        </button>
      </div>

      <div className="card">
        <div className="flex justify-end mb-3 sm:mb-4">
          <button onClick={() => setShowFilterModal(!showFilterModal)} className="btn-secondary flex items-center gap-2 text-sm sm:text-base">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Room</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Quantity</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Value</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{asset.name}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{asset.category}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">{asset.room}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">{asset.quantity}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">{asset.value}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`${statusColors[asset.status]} text-xs`}>{asset.status}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(asset)} className="text-primary hover:text-blue-700">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="text-danger hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Filter Assets</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base">
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Status</label>
                <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Repair">Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={() => { setFilters({ category: 'All', status: 'All' }); setShowFilterModal(false); }} className="flex-1 btn-secondary text-sm sm:text-base">Clear</button>
              <button onClick={() => setShowFilterModal(false)} className="flex-1 btn-primary text-sm sm:text-base">Apply</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Asset Name</label>
                <input type="text" placeholder="Enter asset name" value={editingAsset ? editingAsset.name : newAsset.name} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, name: e.target.value}) : setNewAsset({...newAsset, name: e.target.value})} className="input-field text-sm sm:text-base" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
                <input type="text" placeholder="e.g., Electronics, Furniture" value={editingAsset ? editingAsset.category : newAsset.category} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, category: e.target.value}) : setNewAsset({...newAsset, category: e.target.value})} className="input-field text-sm sm:text-base" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Room</label>
                <input type="text" placeholder="e.g., Lab 3, Room 101" value={editingAsset ? editingAsset.room : newAsset.room} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, room: e.target.value}) : setNewAsset({...newAsset, room: e.target.value})} className="input-field text-sm sm:text-base" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Quantity</label>
                <input type="number" placeholder="Enter quantity" value={editingAsset ? editingAsset.quantity : newAsset.quantity} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, quantity: parseInt(e.target.value)}) : setNewAsset({...newAsset, quantity: parseInt(e.target.value)})} className="input-field text-sm sm:text-base" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Value</label>
                <input type="text" placeholder="e.g., $1,000" value={editingAsset ? editingAsset.value : newAsset.value} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, value: e.target.value}) : setNewAsset({...newAsset, value: e.target.value})} className="input-field text-sm sm:text-base" />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Status</label>
                <select value={editingAsset ? editingAsset.status : newAsset.status} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, status: e.target.value}) : setNewAsset({...newAsset, status: e.target.value})} className="input-field text-sm sm:text-base">
                  <option value="Active">Active</option>
                  <option value="Repair">Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary text-sm sm:text-base">Save Changes</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary text-sm sm:text-base">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
