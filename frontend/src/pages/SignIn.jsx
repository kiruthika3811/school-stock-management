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
  const { login, loginWithGoogle } = useAuth();

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

  const handleGoogleSignIn = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10 w-full max-w-md">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-2xl flex items-center justify-center">
              <Package className="text-white" size={32} />
            </div>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base text-gray-500">Sign in with your Google account</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm text-center mb-4">{error}</div>}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm text-sm sm:text-base flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
            <p className="text-xs text-blue-700 text-center">
              <strong>Note:</strong> New Google accounts require admin approval before access is granted.
            </p>
          </div>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
            Need access?{' '}
            <button onClick={() => setShowContactModal(true)} className="text-primary font-semibold hover:underline">
              Request Account
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-12 relative overflow-hidden bg-white">
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
          <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor: '#f3e8ff'}}>
                <Mail style={{color: '#2d1270'}} size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold" style={{color: '#2d1270'}}>Request Access</h2>
                <p className="text-xs sm:text-sm text-gray-500">Submit your information to the administrator</p>
              </div>
            </div>

            {successMessage ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-green-700 font-medium text-center text-sm sm:text-base">{successMessage}</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={requestName}
                    onChange={(e) => setRequestName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  The administrator will review your request and contact you if approved.
                </p>
              </div>
            )}

            {!successMessage && (
              <div className="flex gap-2 sm:gap-3">
                <button onClick={handleAccessRequest} className="flex-1 bg-primary text-white py-2.5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition-all text-sm sm:text-base">
                  Send Request
                </button>
                <button onClick={() => setShowContactModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm sm:text-base">
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
