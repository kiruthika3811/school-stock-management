import React, { useState, useMemo } from 'react';
import { MapPin, Package } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';

const RoomAssets = () => {
  const { data: assets } = useFirebaseData('assets');
  
  const { rooms, roomAssets } = useMemo(() => {
    const roomsSet = new Set();
    const assetsByRoom = {};
    
    assets.forEach(asset => {
      const room = asset.room || 'Unassigned';
      roomsSet.add(room);
      
      if (!assetsByRoom[room]) {
        assetsByRoom[room] = [];
      }
      assetsByRoom[room].push(asset);
    });
    
    return {
      rooms: Array.from(roomsSet).sort(),
      roomAssets: assetsByRoom
    };
  }, [assets]);
  
  const [selectedRoom, setSelectedRoom] = useState(rooms[0] || 'No rooms');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Room-wise Assets</h1>
        <p className="text-gray-500">View assets by location</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="font-bold mb-4">Rooms</h3>
          <div className="space-y-2">
            {rooms.map((room) => (
              <button key={room} onClick={() => setSelectedRoom(room)} className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${selectedRoom === room ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                <MapPin size={18} />
                {room}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">{selectedRoom}</h3>
            {roomAssets[selectedRoom] ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomAssets[selectedRoom].map((asset) => (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1">{asset.name}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">Quantity: <span className="font-medium">{asset.quantity || 1}</span></p>
                          <p className="text-gray-600">Category: <span className="font-medium">{asset.category || 'General'}</span></p>
                          <p className="text-gray-600">Value: <span className="font-medium">{asset.value || 'N/A'}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No assets found in this room</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAssets;
