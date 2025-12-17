# 🏫 School Stock Management System

**A comprehensive web-based application for managing school assets, inventory, and equipment tracking with reusable books module.**

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Configure Firebase
# Edit: frontend/src/firebase/config.js

# 3. Start application
npm start
```

**First time?** Go to `http://localhost:3000/#/setup` to create your admin account.

---

## 📋 Features

- 📊 **Dashboard Analytics** - Visual overview of assets and statistics
- 📦 **Asset Management** - Track all school equipment
- 📋 **Stock Control** - Monitor inventory with alerts
- 📚 **Library Management** - Manage books with reusable module
- 🏢 **Room Assignment** - Organize assets by location
- 🔧 **Repair Tracking** - Log equipment maintenance
- 🛒 **Purchase Requests** - Handle procurement workflow

---

## 📚 Books Module

**Reusable module for book management operations:**

```javascript
import booksModule from './src/services/booksModule';

// Get all books
const books = await booksModule.books.getAllBooks();

// Search and filter
const filtered = booksModule.books.searchBooks(books, 'search term');

// Manage selections
const selected = booksModule.selectedBooks.toggleSelection(ids, bookId);

// Bulk operations
await booksModule.selectedBooks.bulkDeleteSelected(selectedIds);
```

**Available Functions:**
- `getAllBooks()`, `addBook()`, `updateBook()`, `deleteBook()`
- `searchBooks()`, `filterByCategory()`, `getBooksByAuthor()`
- `getSelectedBooks()`, `bulkUpdateSelected()`, `bulkDeleteSelected()`

---

## 🛠️ Technology

- **Frontend:** React + Tailwind CSS
- **Backend:** Firebase (Authentication + Firestore)
- **Data Tables:** AG Grid
- **Charts:** Recharts
- **Module Export:** Reusable books management

---

**Version:** 1.1  
**Status:** ✅ Ready to use with books module
