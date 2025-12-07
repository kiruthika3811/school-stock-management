import React, { useState } from 'react';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LowStockAlerts = () => {
  const navigate = useNavigate();
  
  const [alerts, setAlerts] = useState(() => {
    const stockItems = JSON.parse(localStorage.getItem('stockItems') || '[]');
    return stockItems
      .filter(item => item.status === 'low' || item.status === 'critical')
      .map(item => ({
        id: item.id,
        item: item.name,
        current: item.current,
        minimum: item.minimum,
        severity: item.status,
        category: item.category
      }));
  });
  
  const handleOrder = (alert) => {
    const shortage = alert.minimum - alert.current;
    const purchaseRequest = {
      id: Date.now(),
      itemName: alert.item,
      quantity: shortage,
      cost: `$${shortage * 10}`,
      justification: `Low stock alert - Current: ${alert.current}, Required: ${alert.minimum}`,
      status: 'Pending',
      timestamp: new Date().toLocaleString()
    };
    const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    localStorage.setItem('purchases', JSON.stringify([...existingPurchases, purchaseRequest]));
    navigate('/purchases');
  };

  const severityColors = {
    low: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500' },
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Low Stock Alerts</h1>
        <p className="text-gray-500">Items requiring immediate attention</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={24} /></div>
            <div><p className="text-sm text-gray-500">Low Stock Items</p><p className="text-2xl font-bold">{alerts.filter(a => a.severity === 'low').length}</p></div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
            <div><p className="text-sm text-gray-500">Critical Stock Items</p><p className="text-2xl font-bold">{alerts.filter(a => a.severity === 'critical').length}</p></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const colors = severityColors[alert.severity];
          return (
            <div key={alert.id} className={`${colors.bg} border ${colors.border} rounded-xl p-6`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 bg-white rounded-lg ${colors.icon}`}><AlertTriangle size={24} /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{alert.item}</h3>
                      <span className={`badge ${alert.severity === 'critical' ? 'badge-danger' : 'badge-warning'}`}>{alert.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-gray-600 mb-3">Category: {alert.category}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div><p className="text-gray-600">Current Stock</p><p className={`text-2xl font-bold ${colors.text}`}>{alert.current}</p></div>
                      <div><p className="text-gray-600">Minimum Required</p><p className="text-2xl font-bold text-gray-700">{alert.minimum}</p></div>
                      <div><p className="text-gray-600">Shortage</p><p className="text-2xl font-bold text-red-600">{alert.minimum - alert.current}</p></div>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleOrder(alert)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                  <ShoppingCart size={18} />
                  Order Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LowStockAlerts;
