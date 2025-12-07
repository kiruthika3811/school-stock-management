import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import StockManagement from './pages/StockManagement';
import RoomAssets from './pages/RoomAssets';
import RepairHistory from './pages/RepairHistory';
import LowStockAlerts from './pages/LowStockAlerts';
import PurchaseRequests from './pages/PurchaseRequests';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto">
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
    </Router>
  );
}

export default App;
