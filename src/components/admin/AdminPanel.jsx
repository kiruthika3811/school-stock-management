import React, { useState, useEffect } from 'react';
import { Users, Check, X, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPanel = () => {
  const [accessRequests, setAccessRequests] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const { user, approveAccessRequest, rejectAccessRequest } = useAuth();

  useEffect(() => {
    loadAccessRequests();
  }, []);

  const loadAccessRequests = () => {
    const requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const pendingRequests = requests.filter(r => r.status === 'pending');
    setAccessRequests(pendingRequests);
  };

  const handleApprove = async (requestId) => {
    const role = selectedRoles[requestId] || 'staff';
    await approveAccessRequest(requestId, role);
    loadAccessRequests();
  };

  const handleReject = async (requestId) => {
    await rejectAccessRequest(requestId);
    loadAccessRequests();
  };

  if (user?.role !== 'admin' || accessRequests.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Users className="text-orange-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Pending Access Requests</h3>
          <p className="text-sm text-gray-500">{accessRequests.length} request(s) awaiting approval</p>
        </div>
      </div>

      <div className="space-y-4">
        {accessRequests.map((request) => (
          <div key={request.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-800">{request.name}</h4>
                  {request.authMethod === 'google' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Google
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{request.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{request.requestDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedRoles[request.id] || 'staff'}
                onChange={(e) => setSelectedRoles({...selectedRoles, [request.id]: e.target.value})}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={() => handleApprove(request.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
              >
                <Check size={16} /> Approve
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;