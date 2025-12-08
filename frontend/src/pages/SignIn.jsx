import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff, Mail, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestName, setRequestName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAccessRequest = () => {
    if (!requestEmail || !requestName) {
      setError('Please fill in all fields');
      return;
    }

    const accessRequests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    const newRequest = {
      id: Date.now(),
      name: requestName,
      email: requestEmail,
      status: 'pending',
      requestDate: new Date().toLocaleString()
    };
    accessRequests.push(newRequest);
    localStorage.setItem('accessRequests', JSON.stringify(accessRequests));

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now(),
      type: 'access_request',
      requestId: newRequest.id,
      title: 'New Account Access Request',
      message: `${requestName} (${requestEmail}) has requested access to the system.`,
      time: new Date().toLocaleString(),
      read: false
    };
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    setSuccessMessage('Your request has been sent to the administrator!');
    setTimeout(() => {
      setShowContactModal(false);
      setSuccessMessage('');
      setRequestEmail('');
      setRequestName('');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <Package className="text-white" size={40} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button onClick={() => setShowContactModal(true)} className="text-primary font-semibold hover:underline">
              Contact Administrator
            </button>
          </p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-12 relative overflow-hidden bg-white">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{backgroundColor: '#2d1270'}}></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-10 animate-pulse" style={{backgroundColor: '#2d1270', animationDelay: '1s'}}></div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 relative">
            <svg className="mx-auto" width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="200" cy="280" rx="120" ry="12" fill="#E5E7EB" opacity="0.4"/>
              <rect x="80" y="80" width="240" height="180" rx="16" fill="#FFF" stroke="#2d1270" strokeWidth="4"/>
              <rect x="80" y="80" width="240" height="50" rx="16" fill="#2d1270"/>
              <circle cx="110" cy="105" r="12" fill="#FFF" opacity="0.3"/>
              <circle cx="140" cy="105" r="12" fill="#FFF" opacity="0.3"/>
              <circle cx="170" cy="105" r="12" fill="#FFF" opacity="0.3"/>
              <rect x="100" y="150" width="80" height="60" rx="8" fill="#2d1270" opacity="0.1"/>
              <rect x="105" y="155" width="70" height="50" rx="6" fill="#2d1270"/>
              <rect x="115" y="165" width="20" height="30" fill="#FFF" opacity="0.9"/>
              <rect x="145" y="165" width="20" height="30" fill="#FFF" opacity="0.9"/>
              <rect x="210" y="150" width="80" height="60" rx="8" fill="#10B981" opacity="0.1"/>
              <circle cx="250" cy="180" r="20" fill="#10B981"/>
              <path d="M242 180 L248 186 L258 174" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="100" y="220" width="190" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="100" y="220" width="140" height="8" rx="4" fill="#2d1270"/>
              <rect x="100" y="235" width="190" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="100" y="235" width="95" height="8" rx="4" fill="#10B981"/>
              <circle cx="50" cy="120" r="28" fill="#2d1270" opacity="0.15"/>
              <path d="M50 105 L50 135 M35 120 L65 120" stroke="#2d1270" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="350" cy="180" r="28" fill="#10B981" opacity="0.15"/>
              <path d="M340 180 L347 187 L360 170" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-5xl font-bold mb-4" style={{color: '#2d1270'}}>Admin Portal</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Manage parent access, track student information, and oversee all administrative tasks in one place.
          </p>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#f3e8ff'}}>
                <Mail style={{color: '#2d1270'}} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{color: '#2d1270'}}>Request Access</h2>
                <p className="text-sm text-gray-500">Submit your information to the administrator</p>
              </div>
            </div>

            {successMessage ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-medium text-center">{successMessage}</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  The administrator will review your request and contact you if approved.
                </p>
              </div>
            )}

            {!successMessage && (
              <div className="flex gap-3">
                <button onClick={handleAccessRequest} className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all">
                  Send Request
                </button>
                <button onClick={() => setShowContactModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
