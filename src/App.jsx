import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import StockManagement from './pages/StockManagement';
import Library from './pages/Library';
import RoomAssets from './pages/RoomAssets';
import RepairHistory from './pages/RepairHistory';
import LowStockAlerts from './pages/LowStockAlerts';
import PurchaseRequests from './pages/PurchaseRequests';
import SignIn from './pages/SignIn';
import SetupUsers from './pages/SetupUsers';
import { initializeDatabase } from './scripts/initializeDatabase';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize database with sample data when user logs in
    if (user) {
      const hasInitialized = localStorage.getItem('dbInitialized');
      if (!hasInitialized) {
        initializeDatabase().then((success) => {
          if (success) {
            localStorage.setItem('dbInitialized', 'true');
          }
        });
      }
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/setup" element={<SetupUsers />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/*" element={
          <ProtectedRoute>
          <div className="flex h-screen bg-primary">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex flex-col overflow-hidden bg-white lg:rounded-tl-[40px]">
              <Navbar toggleSidebar={toggleSidebar} />
              
              <main className="flex-1 overflow-y-auto bg-gray-50 overscroll-contain">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/assets" element={<AssetList />} />
                  <Route path="/stock" element={<StockManagement />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/rooms" element={<RoomAssets />} />
                  <Route path="/repairs" element={<RepairHistory />} />
                  <Route path="/alerts" element={<LowStockAlerts />} />
                  <Route path="/purchases" element={<PurchaseRequests />} />
                </Routes>
              </main>
            </div>
          </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
