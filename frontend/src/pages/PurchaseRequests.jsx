import React, { useState } from 'react';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import databaseService from '../services/databaseService';

const PurchaseRequests = () => {


  const handleApprove = async (firebaseId) => {
    try {
      await databaseService.updatePurchaseRequest(firebaseId, { status: 'Approved' });
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (firebaseId) => {
    try {
      await databaseService.updatePurchaseRequest(firebaseId, { status: 'Rejected' });
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const { data: purchases, loading } = useFirebaseData('purchases');
  const requests = purchases || [];
  const [filter, setFilter] = useState('all');

  const statusConfig = {
    'Approved': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', badge: 'badge-success' },
    'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', badge: 'badge-warning' },
    'Rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', badge: 'badge-danger' }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Purchase Requests</h1>
          <p className="text-gray-500">Track all purchase requests and approvals</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <TrendingUp size={20} />
          New Purchase Request
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          All
        </button>
        <button onClick={() => setFilter('Approved')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Approved
        </button>
        <button onClick={() => setFilter('Pending')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Pending' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Pending
        </button>
        <button onClick={() => setFilter('Rejected')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Rejected
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
            <div><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold">{requests.filter(r => r.status === 'Approved').length}</p></div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={24} /></div>
            <div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{requests.filter(r => r.status === 'Pending').length}</p></div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg"><XCircle size={24} /></div>
            <div><p className="text-sm text-gray-500">Rejected</p><p className="text-2xl font-bold">{requests.filter(r => r.status === 'Rejected').length}</p></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const config = statusConfig[request.status];
            return (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 ${config.bg} rounded-lg ${config.color}`}><TrendingUp size={24} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{request.itemName}</h3>
                        <span className={config.badge}>{request.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div><p className="text-gray-500">Quantity</p><p className="font-medium">{request.quantity}</p></div>
                        <div><p className="text-gray-500">Cost</p><p className="font-medium">{request.cost}</p></div>
                        <div><p className="text-gray-500">Date</p><p className="font-medium">{request.date}</p></div>
                        <div><p className="text-gray-500">Justification</p><p className="font-medium">{request.justification}</p></div>
                      </div>
                      {request.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(request.firebaseId)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">Approve</button>
                          <button onClick={() => handleReject(request.firebaseId)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;
