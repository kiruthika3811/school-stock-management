import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

class DatabaseService {
  // Assets Management
  async addAsset(assetData) {
    const newAsset = {
      ...assetData,
      id: Date.now().toString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'assets'), newAsset);
  }

  async updateAsset(assetId, updates) {
    const assetRef = doc(db, 'assets', assetId);
    return await updateDoc(assetRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteAsset(assetId) {
    const assetRef = doc(db, 'assets', assetId);
    return await deleteDoc(assetRef);
  }

  subscribeToAssets(callback) {
    return onSnapshot(collection(db, 'assets'), (snapshot) => {
      const assets = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(assets);
    });
  }

  // Stock Management
  async addStockItem(stockData) {
    const newStock = {
      ...stockData,
      id: Date.now().toString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'stock'), newStock);
  }

  async updateStock(stockId, updates) {
    const stockRef = doc(db, 'stock', stockId);
    return await updateDoc(stockRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  subscribeToStock(callback) {
    return onSnapshot(collection(db, 'stock'), (snapshot) => {
      const stock = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(stock);
    });
  }

  // Repair Management
  async addRepair(repairData) {
    const newRepair = {
      ...repairData,
      id: Date.now().toString(),
      status: repairData.status || 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'repairs'), newRepair);
  }

  async updateRepair(repairId, updates) {
    const repairRef = doc(db, 'repairs', repairId);
    return await updateDoc(repairRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  subscribeToRepairs(callback) {
    return onSnapshot(collection(db, 'repairs'), (snapshot) => {
      const repairs = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(repairs);
    });
  }

  // Purchase Requests
  async addPurchaseRequest(purchaseData) {
    const newPurchase = {
      ...purchaseData,
      id: Date.now().toString(),
      status: purchaseData.status || 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'purchases'), newPurchase);
  }

  async updatePurchaseRequest(purchaseId, updates) {
    const purchaseRef = doc(db, 'purchases', purchaseId);
    return await updateDoc(purchaseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  subscribeToPurchases(callback) {
    return onSnapshot(collection(db, 'purchases'), (snapshot) => {
      const purchases = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(purchases);
    });
  }

  // Notifications
  async addNotification(notificationData) {
    const newNotification = {
      ...notificationData,
      id: Date.now().toString(),
      read: false,
      createdAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'notifications'), newNotification);
  }

  subscribeToNotifications(callback) {
    return onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(notifications.sort((a, b) => b.createdAt - a.createdAt));
    });
  }

  // User Management
  async addUser(userData) {
    const newUser = {
      ...userData,
      id: userData.id || Date.now().toString(),
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };
    return await addDoc(collection(db, 'users'), newUser);
  }

  async updateUser(userId, updates) {
    const userRef = doc(db, 'users', userId);
    return await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async updateUserLogin(userId) {
    const userRef = doc(db, 'users', userId);
    return await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  }

  subscribeToUsers(callback) {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(users);
    });
  }

  // Book Management
  async addBook(bookData) {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(collection(db, 'books'), newBook);
  }

  async updateBook(bookId, updates) {
    const bookRef = doc(db, 'books', bookId);
    return await updateDoc(bookRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async deleteBook(bookId) {
    const bookRef = doc(db, 'books', bookId);
    return await deleteDoc(bookRef);
  }

  subscribeToBooks(callback) {
    return onSnapshot(collection(db, 'books'), (snapshot) => {
      const books = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      callback(books);
    });
  }

  // Dashboard Statistics
  subscribeToStats(callback) {
    let stats = { totalAssets: 0, stockItems: 0, pendingRepairs: 0, lowStockAlerts: 0 };
    
    const unsubscribeAssets = onSnapshot(collection(db, 'assets'), (snapshot) => {
      stats.totalAssets = snapshot.size;
      callback(stats);
    });

    const unsubscribeStock = onSnapshot(collection(db, 'stock'), (snapshot) => {
      stats.stockItems = snapshot.size;
      stats.lowStockAlerts = snapshot.docs.filter(doc => {
        const item = doc.data();
        return item.currentStock <= (item.minStock || 10);
      }).length;
      callback(stats);
    });

    const unsubscribeRepairs = onSnapshot(collection(db, 'repairs'), (snapshot) => {
      stats.pendingRepairs = snapshot.docs.filter(doc => 
        doc.data().status === 'Pending'
      ).length;
      callback(stats);
    });

    return () => {
      unsubscribeAssets();
      unsubscribeStock();
      unsubscribeRepairs();
    };
  }
}

export default new DatabaseService();