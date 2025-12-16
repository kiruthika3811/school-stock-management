import React, { useState } from 'react';
import { Wrench, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import databaseService from '../services/databaseService';

const RepairHistory = () => {


  const [showModal, setShowModal] = useState(false);
  const [newRepair, setNewRepair] = useState({ assetName: '', location: '', issue: '', cost: '' });
  const [filter, setFilter] = useState('All');

  const handleUpdateStatus = async (firebaseId, newStatus) => {
    try {
      await databaseService.updateRepair(firebaseId, { status: newStatus });
    } catch (error) {
      console.error('Error updating repair status:', error);
    }
  };

  const handleSubmitRepair = async () => {
    try {
      await databaseService.addRepair({
        assetName: newRepair.assetName,
        issue: newRepair.issue,
        location: newRepair.location,
        cost: newRepair.cost || 'TBD'
      });
      setShowModal(false);
      setNewRepair({ assetName: '', location: '', issue: '', cost: '' });
    } catch (error) {
      console.error('Error submitting repair:', error);
    }
  };

  const { data: repairs, loading } = useFirebaseData('repairs');

  const filteredRepairs = filter === 'All' ? repairs : repairs.filter(r => r.status === filter);

  const statusConfig = {
    'Completed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', badge: 'badge-success' },
    'In Progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', badge: 'badge-info' },
    'Pending': { icon: XCircle, color: 'text-amber-600', bg: 'bg-amber-100', badge: 'badge-warning' }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Repair History</h1>
          <p className="text-gray-500">Track all repair requests and status</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Wrench size={20} />
          Report New Repair
        </button>
      </div>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg font-medium ${filter === 'All' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>All ({repairs.length})</button>
        <button onClick={() => setFilter('Completed')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${filter === 'Completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}><CheckCircle size={18} />Completed ({repairs.filter(r => r.status === 'Completed').length})</button>
        <button onClick={() => setFilter('In Progress')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${filter === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}><Clock size={18} />In Progress ({repairs.filter(r => r.status === 'In Progress').length})</button>
        <button onClick={() => setFilter('Pending')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${filter === 'Pending' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'}`}><XCircle size={18} />Pending ({repairs.filter(r => r.status === 'Pending').length})</button>
      </div>
      <div className="card">
        <div className="space-y-4">
          {filteredRepairs.map((repair) => {
            const config = statusConfig[repair.status];
            return (
              <div key={repair.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 ${config.bg} rounded-lg ${config.color}`}><Wrench size={24} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{repair.assetName}</h3>
                        <span className={config.badge}>{repair.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div><p className="text-gray-500">Location</p><p className="font-medium">{repair.location}</p></div>
                        <div><p className="text-gray-500">Issue</p><p className="font-medium">{repair.issue}</p></div>
                        <div><p className="text-gray-500">Date</p><p className="font-medium">{repair.createdAt ? new Date(repair.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p></div>
                        <div><p className="text-gray-500">Cost</p><p className="font-medium">{repair.cost || 'TBD'}</p></div>
                      </div>
                      {repair.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(repair.firebaseId, 'In Progress')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">Start Repair</button>
                        </div>
                      )}
                      {repair.status === 'In Progress' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(repair.firebaseId, 'Completed')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">Mark Completed</button>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Report New Repair</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Name</label>
                <input type="text" placeholder="e.g., Projector" value={newRepair.assetName} onChange={(e) => setNewRepair({...newRepair, assetName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" placeholder="e.g., Room 201" value={newRepair.location} onChange={(e) => setNewRepair({...newRepair, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issue Description</label>
                <textarea placeholder="Describe the issue" value={newRepair.issue} onChange={(e) => setNewRepair({...newRepair, issue: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estimated Cost</label>
                <input type="text" placeholder="e.g., 500 (optional)" value={newRepair.cost} onChange={(e) => setNewRepair({...newRepair, cost: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmitRepair} className="flex-1 btn-primary">Submit</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairHistory;
