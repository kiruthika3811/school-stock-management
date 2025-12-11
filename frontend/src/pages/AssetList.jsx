import React, { useState, useMemo } from 'react';
import { Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useFirebaseData } from '../hooks/useFirebaseData';
import databaseService from '../services/databaseService';

const AssetList = () => {

  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', room: '', quantity: 0, value: '' });
  const [filters, setFilters] = useState({ category: 'All' });
  
  const { data: assets, loading, error } = useFirebaseData('assets');

  const handleDelete = async (firebaseId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await databaseService.deleteAsset(firebaseId);
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Error deleting asset. Please try again.');
      }
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingAsset) {
        await databaseService.updateAsset(editingAsset.firebaseId, {
          name: editingAsset.name,
          category: editingAsset.category,
          room: editingAsset.room,
          quantity: editingAsset.quantity,
          value: editingAsset.value
        });
      } else {
        await databaseService.addAsset({
          name: newAsset.name,
          category: newAsset.category,
          room: newAsset.room,
          quantity: newAsset.quantity,
          value: newAsset.value
        });
        setNewAsset({ name: '', category: '', room: '', quantity: 0, value: '' });
      }
      setShowModal(false);
      setEditingAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Error saving asset. Please try again.');
    }
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = filters.category === 'All' || asset.category === filters.category;
    return matchesCategory;
  });

  const columnDefs = useMemo(() => [
    { field: 'name', headerName: 'Asset Name', flex: 1, sortable: true, filter: true },
    { field: 'category', headerName: 'Category', flex: 1, sortable: true, filter: true },
    { field: 'room', headerName: 'Room', flex: 1, sortable: true, filter: true },
    { field: 'quantity', headerName: 'Quantity', width: 120, sortable: true, filter: 'agNumberColumnFilter' },
    { field: 'value', headerName: 'Value', width: 120, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params) => (
        <div className="flex gap-2 h-full items-center">
          <button onClick={() => handleEdit(params.data)} className="text-primary hover:text-primary/80">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(params.data.firebaseId)} className="text-red-600 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      ),
      sortable: false,
      filter: false
    }
  ], []);



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



      <div className="card">
        <div className="flex justify-end mb-3 sm:mb-4">
          <button onClick={() => setShowFilterModal(!showFilterModal)} className="btn-secondary flex items-center gap-2 text-sm sm:text-base">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading assets...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">Error loading assets: {error.message}</div>
        ) : (
          <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
            <AgGridReact
              rowData={filteredAssets}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true
              }}
              suppressRowClickSelection={true}
            />
          </div>
        )}
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

            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button onClick={() => { setFilters({ category: 'All' }); setShowFilterModal(false); }} className="flex-1 btn-secondary text-sm sm:text-base">Clear</button>
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
