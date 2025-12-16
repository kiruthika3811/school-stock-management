# 🏫 School Stock Management - Clean Project Structure

## 📁 Root Directory
```
school-stock-management/
├── frontend/                    # React application
├── .firebase/                   # Firebase deployment cache
├── .github/workflows/           # GitHub Actions
├── .gitignore                   # Git ignore rules
├── COMPLETE_DOCUMENTATION.md    # Complete project documentation
├── database.rules.json          # Firebase security rules
├── DEPLOYMENT.md               # Deployment instructions
├── FIREBASE_SETUP.md           # Firebase configuration guide
├── firebase.json               # Firebase project config
├── GOOGLE_AUTH_SETUP.md        # Google authentication setup
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Project overview
```

## 📁 Frontend Structure
```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   ├── logo.svg               # Application logo
│   ├── _redirects             # Netlify redirects
│   └── .nojekyll              # GitHub Pages config
├── src/
│   ├── components/            # Reusable React components
│   │   ├── admin/
│   │   │   ├── AdminPanel.jsx     # Admin management interface
│   │   │   └── DatabaseInit.jsx   # Database initialization
│   │   ├── common/
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   └── Sidebar.jsx        # Side navigation menu
│   │   ├── dashboard/
│   │   │   └── StatsCard.jsx      # Dashboard statistics cards
│   │   ├── BulkBookImport.jsx     # Bulk book import modal
│   │   └── UserForm.jsx           # User creation form
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication context
│   ├── firebase/
│   │   └── config.js              # Firebase configuration
│   ├── hooks/
│   │   ├── useFirebaseData.js     # Firebase data fetching hook
│   │   └── useRealtimeDatabase.js # Real-time database hook
│   ├── pages/                     # Main application pages
│   │   ├── AssetList.jsx          # Asset management page
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── Library.jsx            # Library management
│   │   ├── LowStockAlerts.jsx     # Stock alerts page
│   │   ├── PurchaseRequests.jsx   # Purchase requests
│   │   ├── RepairHistory.jsx      # Repair tracking
│   │   ├── RoomAssets.jsx         # Room-based assets
│   │   ├── SetupUsers.jsx         # User setup page
│   │   ├── SignIn.jsx             # Authentication page
│   │   └── StockManagement.jsx    # Stock management
│   ├── scripts/
│   │   ├── createAdmin.js         # Admin user creation script
│   │   └── initializeDatabase.js  # Database setup script
│   ├── services/
│   │   └── databaseService.js     # Database operations service
│   ├── styles/
│   │   └── globals.css            # Global CSS styles
│   ├── App.jsx                    # Main application component
│   ├── index.css                  # Base CSS styles
│   └── index.js                   # Application entry point
├── craco.config.js               # Create React App configuration
├── package.json                  # Node.js dependencies
├── package-lock.json             # Dependency lock file
├── postcss.config.js             # PostCSS configuration
└── tailwind.config.js            # Tailwind CSS configuration
```

## 🧹 Cleaned Up Files
The following unnecessary files have been removed:
- ❌ `backend/` - Unused backend folder (Firebase handles backend)
- ❌ Duplicate `src/` and `public/` folders in root
- ❌ `firebase-debug.log` files
- ❌ Duplicate config files in root
- ❌ `.vercelignore` file
- ❌ Deployment batch files (`deploy-*.bat`)
- ❌ Unused script files

## 🚀 Quick Start
```bash
cd frontend
npm install
npm start
```

## 📝 Key Features
- **Clean Architecture**: Organized by feature and responsibility
- **React + Firebase**: Modern web stack
- **Tailwind CSS**: Utility-first styling
- **Component-based**: Reusable UI components
- **Real-time Data**: Live updates with Firebase
- **Authentication**: Secure user management