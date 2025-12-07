import React, { useState, useMemo } from 'react';
import { Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const AssetList = () => {

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
    const matchesCategory = filters.category === 'All' || asset.category === filters.category;
    const matchesStatus = filters.status === 'All' || asset.status === filters.status;
    return matchesCategory && matchesStatus;
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
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowFilterModal(!showFilterModal)} className="btn-secondary flex items-center gap-2">
            <Filter size={20} />
            Filter
          </button>
        </div>

        <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
          <AgGridReact
            rowData={filteredAssets}
            columnDefs={[
              { field: 'name', headerName: 'Asset Name', filter: true, sortable: true, flex: 1 },
              { field: 'category', headerName: 'Category', filter: true, sortable: true, flex: 1 },
              { field: 'room', headerName: 'Room', filter: true, sortable: true, flex: 1 },
              { field: 'quantity', headerName: 'Quantity', filter: true, sortable: true, width: 120 },
              { field: 'value', headerName: 'Value', filter: true, sortable: true, width: 120 },
              { 
                field: 'status', 
                headerName: 'Status', 
                filter: true, 
                sortable: true,
                width: 120,
                cellRenderer: (params) => {
                  const colors = {
                    Active: 'badge-success',
                    Repair: 'badge-warning',
                    Retired: 'badge-danger'
                  };
                  return `<span class="${colors[params.value]}">${params.value}</span>`;
                }
              },
              {
                headerName: 'Actions',
                width: 120,
                cellRenderer: (params) => {
                  const div = document.createElement('div');
                  div.className = 'flex gap-2';
                  div.innerHTML = `
                    <button class="edit-btn text-primary hover:text-blue-700" data-id="${params.data.id}">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="delete-btn text-danger hover:text-red-700" data-id="${params.data.id}">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  `;
                  div.querySelector('.edit-btn').addEventListener('click', () => handleEdit(params.data));
                  div.querySelector('.delete-btn').addEventListener('click', () => handleDelete(params.data.id));
                  return div;
                }
              }
            ]}
            defaultColDef={{
              resizable: true,
              sortable: true,
              filter: true
            }}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
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
