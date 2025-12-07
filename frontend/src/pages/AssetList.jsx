import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Edit, Trash2, Eye } from 'lucide-react';

const AssetList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteHistory, setDeleteHistory] = useState([]);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', room: '', status: 'Active', quantity: 0, value: '' });
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  
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
    const deletedAsset = assets.find(asset => asset.id === id);
    setDeleteHistory([...deleteHistory, { ...deletedAsset, deletedAt: new Date().toLocaleString() }]);
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(updatedAssets);
    localStorage.setItem('assets', JSON.stringify(updatedAssets));
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
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'All' || asset.category === filters.category;
    const matchesStatus = filters.status === 'All' || asset.status === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statusColors = {
    Active: 'badge-success',
    Repair: 'badge-warning',
    Retired: 'badge-danger'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Asset Management</h1>
          <p className="text-gray-500">Manage and track all school assets</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add New Asset
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setShowFilterModal(!showFilterModal)} className="btn-secondary flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Eye size={24} className="text-gray-600" />
                  </div>
                  <span className={statusColors[asset.status]}>{asset.status}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{asset.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{asset.category}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room:</span>
                    <span className="font-medium">{asset.room}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{asset.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">{asset.value}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(asset)} className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <Edit size={16} />
                    Edit
                  </button>
                  <button onClick={() => handleDelete(asset.id)} className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Asset Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Room</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{asset.name}</td>
                    <td className="py-3 px-4 text-gray-600">{asset.category}</td>
                    <td className="py-3 px-4 text-gray-600">{asset.room}</td>
                    <td className="py-3 px-4 text-gray-600">{asset.quantity}</td>
                    <td className="py-3 px-4 text-gray-600">{asset.value}</td>
                    <td className="py-3 px-4">
                      <span className={statusColors[asset.status]}>{asset.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(asset)} className="text-primary hover:text-blue-700">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="text-danger hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Filter Assets</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Lab Equipment">Lab Equipment</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Repair">Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setFilters({ category: 'All', status: 'All' }); setShowFilterModal(false); }} className="flex-1 btn-secondary">Clear</button>
              <button onClick={() => setShowFilterModal(false)} className="flex-1 btn-primary">Apply</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Name</label>
                <input type="text" placeholder="Enter asset name" value={editingAsset ? editingAsset.name : newAsset.name} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, name: e.target.value}) : setNewAsset({...newAsset, name: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" placeholder="e.g., Electronics, Furniture" value={editingAsset ? editingAsset.category : newAsset.category} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, category: e.target.value}) : setNewAsset({...newAsset, category: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <input type="text" placeholder="e.g., Lab 3, Room 101" value={editingAsset ? editingAsset.room : newAsset.room} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, room: e.target.value}) : setNewAsset({...newAsset, room: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" placeholder="Enter quantity" value={editingAsset ? editingAsset.quantity : newAsset.quantity} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, quantity: parseInt(e.target.value)}) : setNewAsset({...newAsset, quantity: parseInt(e.target.value)})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input type="text" placeholder="e.g., $1,000" value={editingAsset ? editingAsset.value : newAsset.value} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, value: e.target.value}) : setNewAsset({...newAsset, value: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={editingAsset ? editingAsset.status : newAsset.status} onChange={(e) => editingAsset ? setEditingAsset({...editingAsset, status: e.target.value}) : setNewAsset({...newAsset, status: e.target.value})} className="input-field">
                  <option value="Active">Active</option>
                  <option value="Repair">Repair</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 btn-primary">Save Changes</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
