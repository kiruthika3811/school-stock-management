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

      <div className="w-1/2 flex items-center justify-center p-12 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #f3e8ff, #ffffff)'}}>
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20" style={{backgroundColor: '#2d1270'}}></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-10" style={{backgroundColor: '#2d1270'}}></div>
        
        <div className="text-center relative z-10">
          <div className="mb-8 relative">
            <svg className="mx-auto" width="450" height="350" viewBox="0 0 450 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="225" cy="310" rx="100" ry="12" fill="#E5E7EB" opacity="0.4"/>
              <rect x="180" y="210" width="90" height="80" rx="6" fill="#1E3A5F"/>
              <rect x="190" y="220" width="70" height="50" rx="3" fill="#374151"/>
              <circle cx="225" cy="245" r="2" fill="#9CA3AF"/>
              <circle cx="225" cy="95" r="45" fill="#C084FC"/>
              <ellipse cx="225" cy="80" rx="35" ry="25" fill="#A855F7"/>
              <circle cx="215" cy="95" r="3" fill="#1F2937"/>
              <circle cx="235" cy="95" r="3" fill="#1F2937"/>
              <path d="M218 105 Q225 110 232 105" stroke="#1F2937" strokeWidth="2" fill="none"/>
              <rect x="190" y="140" width="70" height="70" rx="15" fill="#1E3A5F"/>
              <path d="M190 170 L165 210 L175 215 L200 175 Z" fill="#C084FC"/>
              <path d="M260 170 L285 210 L275 215 L250 175 Z" fill="#C084FC"/>
              <rect x="60" y="100" width="50" height="60" rx="8" fill="#7C3AED" opacity="0.7"/>
              <rect x="70" y="110" width="30" height="35" rx="3" fill="#FFF" opacity="0.9"/>
              <line x1="75" y1="120" x2="95" y2="120" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="75" y1="128" x2="90" y2="128" stroke="#7C3AED" strokeWidth="2"/>
              <line x1="75" y1="136" x2="95" y2="136" stroke="#7C3AED" strokeWidth="2"/>
              <circle cx="360" cy="130" r="35" fill="#EF4444" opacity="0.7"/>
              <circle cx="360" cy="130" r="25" fill="#FFF" opacity="0.9"/>
              <circle cx="360" cy="130" r="15" fill="#EF4444"/>
              <path d="M355 130 L360 135 L370 120" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <rect x="340" y="220" width="45" height="55" rx="6" fill="#F59E0B" opacity="0.6"/>
              <rect x="348" y="228" width="29" height="39" rx="3" fill="#FFF" opacity="0.8"/>
              <path d="M355 240 L365 250 M365 240 L355 250" stroke="#F59E0B" strokeWidth="2"/>
              <circle cx="90" cy="240" r="25" fill="#10B981" opacity="0.6"/>
              <path d="M80 240 L87 247 L100 230" stroke="#FFF" strokeWidth="3" fill="none" strokeLinecap="round"/>
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
