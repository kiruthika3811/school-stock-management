import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import StockManagement from './pages/StockManagement';
import RoomAssets from './pages/RoomAssets';
import RepairHistory from './pages/RepairHistory';
import LowStockAlerts from './pages/LowStockAlerts';
import PurchaseRequests from './pages/PurchaseRequests';
import SignIn from './pages/SignIn';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/*" element={
          <div className="flex h-screen bg-primary">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-tl-[40px]">
              <Navbar toggleSidebar={toggleSidebar} />
              
              <main className="flex-1 overflow-y-auto bg-gray-50">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/assets" element={<AssetList />} />
                  <Route path="/stock" element={<StockManagement />} />
                  <Route path="/rooms" element={<RoomAssets />} />
                  <Route path="/repairs" element={<RepairHistory />} />
                  <Route path="/alerts" element={<LowStockAlerts />} />
                  <Route path="/purchases" element={<PurchaseRequests />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
