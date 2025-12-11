import { ref, set } from 'firebase/database';
import { rtdb } from '../firebase/config';

const sampleAssets = [
  { id: '1', name: 'Dell Laptop', category: 'Electronics', room: 'Lab 3', quantity: 25, value: '25000' },
  { id: '2', name: 'Projector', category: 'Electronics', room: 'Room 201', quantity: 1, value: '1200' },
  { id: '3', name: 'Desk Chair', category: 'Furniture', room: 'Office', quantity: 50, value: '5000' },
  { id: '4', name: 'Microscope', category: 'Lab Equipment', room: 'Science Lab', quantity: 15, value: '18000' },
  { id: '5', name: 'Whiteboard', category: 'Furniture', room: 'Room 105', quantity: 30, value: '3000' },
  { id: '6', name: 'Basketball', category: 'Sports', room: 'Gym', quantity: 20, value: '600' }
];

const sampleStock = [
  { id: '1', itemName: 'Whiteboard Markers', category: 'Stationery', currentStock: 45, minStock: 50, unit: 'pcs' },
  { id: '2', itemName: 'A4 Paper Reams', category: 'Stationery', currentStock: 120, minStock: 50, unit: 'reams' },
  { id: '3', itemName: 'Chemistry Beakers', category: 'Lab', currentStock: 30, minStock: 25, unit: 'pcs' },
  { id: '4', itemName: 'Printer Ink Cartridges', category: 'Electronics', currentStock: 8, minStock: 15, unit: 'pcs' },
  { id: '5', itemName: 'Cleaning Supplies', category: 'Maintenance', currentStock: 25, minStock: 20, unit: 'units' }
];

const sampleRepairs = [
  { id: '1', assetName: 'Projector Room 201', issue: 'No display output', location: 'Room 201', status: 'Pending' },
  { id: '2', assetName: 'Lab Computer #5', issue: 'Won\'t boot up', location: 'Computer Lab', status: 'In Progress' },
  { id: '3', assetName: 'Gym Sound System', issue: 'Crackling audio', location: 'Gymnasium', status: 'Completed' }
];

const samplePurchases = [
  { id: '1', itemName: 'New Laptops', quantity: 10, cost: '15000', justification: 'Replace old computers in Lab 2', status: 'Pending' },
  { id: '2', itemName: 'Office Chairs', quantity: 25, cost: '3750', justification: 'Staff room furniture upgrade', status: 'Approved' },
  { id: '3', itemName: 'Science Equipment', quantity: 1, cost: '8500', justification: 'Chemistry lab expansion', status: 'Ordered' }
];

export const initializeDatabase = async () => {
  try {
    console.log('Initializing Firebase database with sample data...');
    
    // Initialize assets
    for (const asset of sampleAssets) {
      await set(ref(rtdb, `assets/${asset.id}`), {
        ...asset,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    // Initialize stock
    for (const stock of sampleStock) {
      await set(ref(rtdb, `stock/${stock.id}`), {
        ...stock,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    // Initialize repairs
    for (const repair of sampleRepairs) {
      await set(ref(rtdb, `repairs/${repair.id}`), {
        ...repair,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    // Initialize purchases
    for (const purchase of samplePurchases) {
      await set(ref(rtdb, `purchases/${purchase.id}`), {
        ...purchase,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    console.log('Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Auto-initialize if this script is run directly
if (typeof window !== 'undefined') {
  window.initializeDatabase = initializeDatabase;
}