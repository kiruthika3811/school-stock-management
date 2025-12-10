import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Package, AlertCircle } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const StockManagement = () => {
  const defaultStockItems = [
    { id: 1, name: 'Whiteboard Markers', category: 'Stationery', current: 45, minimum: 50, unit: 'pcs', status: 'low' },
    { id: 2, name: 'A4 Paper Reams', category: 'Stationery', current: 120, minimum: 50, unit: 'reams', status: 'good' },
    { id: 3, name: 'Chemistry Beakers', category: 'Lab', current: 30, minimum: 25, unit: 'pcs', status: 'good' },
    { id: 4, name: 'Printer Ink Cartridges', category: 'Electronics', current: 8, minimum: 15, unit: 'pcs', status: 'critical' },
    { id: 5, name: 'Cleaning Supplies', category: 'Maintenance', current: 25, minimum: 20, unit: 'units', status: 'good' }
  ];

  const [stockItems, setStockItems] = useState(() => {
    const saved = localStorage.getItem('stockItems');
    return saved ? JSON.parse(saved) : defaultStockItems;
  });
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', current: 0, minimum: 0, unit: 'pcs' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedStocks = JSON.parse(localStorage.getItem('stocks') || '[]');
    if (savedStocks.length > 0) {
      const updated = stockItems.map(item => {
        const stockUpdate = savedStocks.find(s => s.itemName === item.name);
        return stockUpdate ? { ...item, current: parseInt(stockUpdate.newStock) } : item;
      });
      setStockItems(updated);
      localStorage.setItem('stockItems', JSON.stringify(updated));
      localStorage.removeItem('stocks');
    }
  }, []);

  const updateStatus = (current, minimum) => {
    if (current <= minimum * 0.5) return 'critical';
    if (current < minimum) return 'low';
    return 'good';
  };

  const handleIncrease = (id) => {
    const updated = stockItems.map(item => {
      if (item.id === id) {
        const newCurrent = item.current + 1;
        return { ...item, current: newCurrent, status: updateStatus(newCurrent, item.minimum) };
      }
      return item;
    });
    setStockItems(updated);
    localStorage.setItem('stockItems', JSON.stringify(updated));
  };

  const handleDecrease = (id) => {
    const updated = stockItems.map(item => {
      if (item.id === id && item.current > 0) {
        const newCurrent = item.current - 1;
        return { ...item, current: newCurrent, status: updateStatus(newCurrent, item.minimum) };
      }
      return item;
    });
    setStockItems(updated);
    localStorage.setItem('stockItems', JSON.stringify(updated));
  };

  const handleAddItem = () => {
    const status = newItem.current < newItem.minimum ? 'critical' : newItem.current < newItem.minimum * 1.2 ? 'low' : 'good';
    const item = { id: Date.now(), ...newItem, status };
    const updated = [...stockItems, item];
    setStockItems(updated);
    localStorage.setItem('stockItems', JSON.stringify(updated));
    setShowModal(false);
    setNewItem({ name: '', category: '', current: 0, minimum: 0, unit: 'pcs' });
  };

  const getStatusBadge = (status) => {
    const badges = {
      good: 'badge-success',
      low: 'badge-warning',
      critical: 'badge-danger'
    };
    return badges[status];
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredItems = filter === 'all' ? stockItems : stockItems.filter(item => item.status === filter);

  const columnDefs = useMemo(() => [
    { field: 'name', headerName: 'Item Name', flex: 1, sortable: true, filter: true },
    { field: 'category', headerName: 'Category', flex: 1, sortable: true, filter: true },
    {
      field: 'current',
      headerName: 'Current Stock',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => `${params.value} ${params.data.unit}`
    },
    {
      field: 'minimum',
      headerName: 'Minimum Level',
      width: 150,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => `${params.value} ${params.data.unit}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        const status = params.value;
        const badgeClass = status === 'good' ? 'bg-green-100 text-green-800' :
                          status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params) => (
        <div className="flex gap-2 h-full items-center">
          <button onClick={() => handleIncrease(params.data.id)} className="bg-green-100 text-green-700 p-1 rounded hover:bg-green-200">
            <Plus size={16} />
          </button>
          <button onClick={() => handleDecrease(params.data.id)} className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200">
            <Minus size={16} />
          </button>
        </div>
      ),
      sortable: false,
      filter: false
    }
  ], []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Stock Management</h1>
          <p className="text-gray-500">Monitor and update inventory levels</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Stock Item
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        <button onClick={() => setFilter('good')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'good' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Good
        </button>
        <button onClick={() => setFilter('low')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'low' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Low
        </button>
        <button onClick={() => setFilter('critical')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Critical
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold">{stockItems.reduce((sum, item) => sum + item.current, 0)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold">{stockItems.filter(item => item.status === 'low').length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical Stock</p>
              <p className="text-2xl font-bold">{stockItems.filter(item => item.status === 'critical').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={filteredItems}
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
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Stock Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <input type="text" placeholder="e.g., Whiteboard Markers" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input type="text" placeholder="e.g., Stationery" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Stock</label>
                <input type="number" placeholder="e.g., 50" value={newItem.current} onChange={(e) => setNewItem({...newItem, current: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Level</label>
                <input type="number" placeholder="e.g., 20" value={newItem.minimum} onChange={(e) => setNewItem({...newItem, minimum: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <input type="text" placeholder="e.g., pcs, reams, units" value={newItem.unit} onChange={(e) => setNewItem({...newItem, unit: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddItem} className="flex-1 btn-primary">Add Item</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
