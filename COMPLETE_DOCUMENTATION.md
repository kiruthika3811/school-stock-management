# 🏫 School Stock Management System - Complete Documentation

**A comprehensive web-based application for managing school assets, inventory, and equipment tracking.**

---

## 📋 Table of Contents

1. [Quick Start (5 Minutes)](#quick-start-5-minutes)
2. [Complete Setup Guide](#complete-setup-guide)
3. [Project Structure](#project-structure)
4. [Application Workflows](#application-workflows)
5. [User Guide](#user-guide)
6. [Troubleshooting](#troubleshooting)

---

# 🚀 Quick Start (5 Minutes)

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] Firebase account created
- [ ] Project files downloaded

## Setup in 3 Commands

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

## Firebase Configuration (2 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project
3. Enable Email/Password authentication
4. Create Firestore database
5. Copy your config from Project Settings
6. Edit `frontend/src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Create First User

1. Navigate to: `http://localhost:3000/#/setup`
2. Create admin account
3. Login with your credentials

✅ **You're Ready!** Start by adding your first asset.

---

# 📖 Complete Setup Guide

## 🎯 Overview

The School Stock Management System helps educational institutions efficiently manage assets, track inventory levels, monitor equipment repairs, and handle purchase requests with real-time alerts and comprehensive reporting.

## ✨ Core Features

- **Dashboard Analytics** - Visual overview of assets, stock levels, and key metrics
- **Asset Management** - Track and manage all school assets with detailed information
- **Stock Control** - Monitor inventory levels and receive low-stock alerts
- **Room Assignment** - Assign and track assets by classroom or location
- **Repair Tracking** - Log and monitor equipment repairs and maintenance
- **Purchase Requests** - Submit and approve purchase requisitions
- **User Authentication** - Secure login with Firebase authentication
- **Role-Based Access** - Different permissions for admins and staff

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **React Router 6** - Navigation and routing
- **Tailwind CSS** - Styling framework
- **AG Grid** - Advanced data tables
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend & Database
- **Firebase** - Authentication and real-time database
- **Firestore** - Cloud database for storing assets and records

## 📦 Prerequisites

1. **Node.js** (version 14.0 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional)
   - Download: https://git-scm.com/

4. **Firebase Account**
   - Create: https://firebase.google.com/

## 🚀 Detailed Installation

### Step 1: Download Project
```bash
# If using Git
git clone <repository-url>
cd "School Stock Management"

# Or extract ZIP file to desired location
```

### Step 2: Install Dependencies
```bash
cd frontend
npm install
```

### Step 3: Firebase Setup

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add Project"
   - Follow setup wizard

2. **Enable Authentication**
   - Go to "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" sign-in

3. **Create Firestore Database**
   - Go to "Firestore Database"
   - Click "Create Database"
   - Start in "Production Mode"
   - Choose location

4. **Get Configuration**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click web icon (</>)
   - Copy configuration

5. **Update Config File**
   - Open `frontend/src/firebase/config.js`
   - Replace with your credentials

### Step 4: Run Application

**Development Mode:**
```bash
cd frontend
npm start
```
Access at: `http://localhost:3000`

**Production Build:**
```bash
npm run build
npm install -g serve
serve -s build
```

---

# 📁 Project Structure

## Complete Directory Tree

```
School Stock Management/
│
├── 📄 COMPLETE_DOCUMENTATION.md    ← This file (all docs in one)
├── 📄 .gitignore                   ← Git ignore rules
│
└── 📁 frontend/                    ← Main application
    │
    ├── 📁 public/                  ← Static files
    │   ├── index.html              ← HTML template
    │   └── logo.svg                ← App logo
    │
    ├── 📁 src/                     ← Source code
    │   │
    │   ├── 📁 components/          ← UI components
    │   │   ├── 📁 common/          ← Shared components
    │   │   │   ├── Navbar.jsx      ← Top navigation
    │   │   │   └── Sidebar.jsx     ← Side menu
    │   │   └── 📁 dashboard/       ← Dashboard components
    │   │       └── StatsCard.jsx   ← Statistics cards
    │   │
    │   ├── 📁 context/             ← State management
    │   │   └── AuthContext.jsx     ← Authentication
    │   │
    │   ├── 📁 firebase/            ← Backend config
    │   │   └── config.js           ← Firebase setup
    │   │
    │   ├── 📁 pages/               ← Application pages
    │   │   ├── Dashboard.jsx       ← Home page
    │   │   ├── AssetList.jsx       ← Asset management
    │   │   ├── StockManagement.jsx ← Inventory control
    │   │   ├── RoomAssets.jsx      ← Room assignments
    │   │   ├── RepairHistory.jsx   ← Repair tracking
    │   │   ├── LowStockAlerts.jsx  ← Stock alerts
    │   │   ├── PurchaseRequests.jsx← Purchase orders
    │   │   ├── SignIn.jsx          ← Login page
    │   │   └── SetupUsers.jsx      ← User setup
    │   │
    │   ├── 📁 styles/              ← Global styles
    │   │   └── globals.css         ← CSS variables
    │   │
    │   ├── App.jsx                 ← Main component
    │   ├── index.js                ← Entry point
    │   └── index.css               ← Base styles
    │
    ├── craco.config.js             ← Build configuration
    ├── postcss.config.js           ← PostCSS config
    ├── tailwind.config.js          ← Tailwind config
    ├── package.json                ← Dependencies
    └── package-lock.json           ← Locked versions
```

## Key Files Explained

### Pages (`/frontend/src/pages`)

| File | Route | Purpose |
|------|-------|---------|
| Dashboard.jsx | `/` | Home page with statistics |
| AssetList.jsx | `/assets` | View/manage all assets |
| StockManagement.jsx | `/stock` | Inventory control |
| RoomAssets.jsx | `/rooms` | Assets by location |
| RepairHistory.jsx | `/repairs` | Track repairs |
| LowStockAlerts.jsx | `/alerts` | Stock warnings |
| PurchaseRequests.jsx | `/purchases` | Purchase orders |
| SignIn.jsx | `/signin` | Login page |
| SetupUsers.jsx | `/setup` | Initial setup |

### Components (`/frontend/src/components`)

| File | Purpose | Used In |
|------|---------|---------|
| Navbar.jsx | Top navigation bar | All pages |
| Sidebar.jsx | Side menu navigation | All pages |
| StatsCard.jsx | Statistics display | Dashboard |

### Configuration Files

| File | Purpose |
|------|---------|
| firebase/config.js | Firebase credentials |
| App.jsx | Main app & routing |
| AuthContext.jsx | User authentication |
| tailwind.config.js | Styling configuration |
| package.json | Dependencies & scripts |

---

# 🔄 Application Workflows

## 📱 Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                  SCHOOL STOCK MANAGEMENT                     │
│                                                              │
│  ┌────────────┐  ┌──────────────────────────────────────┐  │
│  │  SIDEBAR   │  │      MAIN CONTENT AREA               │  │
│  │            │  │                                       │  │
│  │  • Home    │  │  ┌─────────────────────────────┐    │  │
│  │  • Assets  │  │  │  NAVBAR                     │    │  │
│  │  • Stock   │  │  │  User Info | Notifications  │    │  │
│  │  • Rooms   │  │  └─────────────────────────────┘    │  │
│  │  • Repairs │  │                                       │  │
│  │  • Alerts  │  │  ┌─────────────────────────────┐    │  │
│  │  • Purchase│  │  │      PAGE CONTENT           │    │  │
│  │            │  │  │  (Dashboard, Assets, etc)   │    │  │
│  │            │  │  └─────────────────────────────┘    │  │
│  └────────────┘  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
START → Open Browser → User Logged In?
                            │
                    ┌───────┴───────┐
                   YES             NO
                    │               │
                    ▼               ▼
              Dashboard      Show Login Page
                                    │
                                    ▼
                            Enter Credentials
                                    │
                                    ▼
                          Firebase Authenticate
                                    │
                            ┌───────┴───────┐
                          Valid         Invalid
                            │               │
                            ▼               ▼
                       Dashboard      Show Error
```

**Steps:**
1. Open application in browser
2. Enter email and password
3. Click "Sign In"
4. Redirected to Dashboard upon success

## 📦 Asset Management Workflow

```
DASHBOARD
    │
    ▼
Click "Assets" in Sidebar
    │
    ▼
Asset List Page
    │
    ├─→ ADD NEW
    │      │
    │      ▼
    │   Fill Asset Details:
    │   • Name
    │   • Category
    │   • Quantity
    │   • Location/Room
    │   • Purchase Date
    │   • Condition
    │      │
    │      ▼
    │   Save to Firebase
    │
    └─→ EDIT EXISTING
           │
           ▼
        Update Details
           │
           ▼
        Save Changes
           │
           ▼
    Update Dashboard Statistics
```

**Process:**
1. Navigate to "Assets" page
2. Click "Add New Asset"
3. Fill in asset details
4. Assign to specific room/location
5. Monitor status on dashboard

## 📊 Stock Monitoring Flow

```
SYSTEM RUNNING
    │
    ▼
Automatic Monitor (Check Stock Levels)
    │
    ▼
Stock Below Threshold?
    │
    ├─→ YES → Generate Alert
    │           │
    │           ▼
    │      Show Alert Badge on Sidebar
    │           │
    │           ▼
    │      User Clicks "Low Stock Alerts"
    │           │
    │           ▼
    │      View Alert List
    │           │
    │           ▼
    │      Create Purchase Request
    │
    └─→ NO → Continue Normal Operation
```

**Process:**
1. System automatically monitors stock levels
2. Alerts appear when stock falls below threshold
3. Create purchase request from alerts page
4. Admin reviews and approves requests

## 🛒 Purchase Request Flow

```
LOW STOCK ALERT
    │
    ▼
Click "Create Purchase Request"
    │
    ▼
Fill Request Form:
• Item Name
• Quantity Needed
• Urgency Level
• Justification
• Estimated Cost
    │
    ▼
Submit Request (Status: PENDING)
    │
    ▼
Notify Admin
    │
    ▼
Admin Reviews Request
    │
    ├─→ APPROVE → Status: APPROVED → Proceed Purchase
    │
    └─→ REJECT → Status: REJECTED → Notify Requester
```

## 🔧 Repair Management Flow

```
ASSET MALFUNCTION
    │
    ▼
Navigate to "Repair History"
    │
    ▼
Click "Report New Issue"
    │
    ▼
Fill Repair Form:
• Select Asset
• Problem Description
• Severity Level
• Date Reported
    │
    ▼
Submit Report (Status: REPORTED)
    │
    ▼
Assign to Maintenance Team
    │
    ▼
Status: IN REPAIR
    │
    ▼
Repair Completed
    │
    ▼
Update Status: COMPLETED
Add Repair Notes
    │
    ▼
Asset Available for Use
```

## 🏢 Room Assignment Flow

```
NEW ASSET ADDED
    │
    ▼
Navigate to "Room Assets"
    │
    ▼
View Rooms List:
• Classrooms
• Labs
• Offices
• Storage
    │
    ▼
Select Room
    │
    ▼
View Assets in Selected Room
    │
    ├─→ ADD ASSET → Update Room Assignment
    │
    └─→ REMOVE ASSET → Update Room Assignment
           │
           ▼
        Save to Database
           │
           ▼
        Update Asset Location Field
```

## 📈 Dashboard Data Flow

```
USER LOGS IN
    │
    ▼
Load Dashboard
    │
    ▼
Fetch Data from Firebase Firestore:
• Assets Collection
• Repairs Collection
• Purchases Collection
• Alerts Collection
    │
    ▼
Calculate Statistics:
• Total Assets
• Assets by Category
• Low Stock Items
• Pending Repairs
• Pending Purchases
    │
    ▼
Render Dashboard:
┌───────────────────┐
│  Stats Cards      │
├───────────────────┤
│  Charts & Graphs  │
├───────────────────┤
│  Recent Activity  │
├───────────────────┤
│  Quick Actions    │
└───────────────────┘
```

## 🎯 User Journey Map

### First-Time User
```
1. SETUP → Create account at /setup
2. EXPLORE → View dashboard, check navigation
3. ADD DATA → Add first asset, assign to room
4. CONFIGURE → Set stock thresholds, configure alerts
5. DAILY USE → Monitor dashboard, respond to alerts
```

### Daily User
```
1. LOGIN → Enter credentials
2. CHECK DASHBOARD → Review statistics, check notifications
3. HANDLE ALERTS → Low stock items, pending repairs
4. PROCESS REQUESTS → Approve purchases, assign repairs
5. UPDATE RECORDS → Add new assets, update statuses
```

## 📱 Page Navigation Map

```
                    ┌─────────────┐
                    │  DASHBOARD  │
                    │   (Home)    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    ASSETS    │   │    STOCK     │   │    ROOMS     │
│              │   │  MANAGEMENT  │   │    ASSETS    │
└──────────────┘   └──────┬───────┘   └──────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  LOW STOCK   │
                   │   ALERTS     │
                   └──────┬───────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  PURCHASE    │
                   │  REQUESTS    │
                   └──────────────┘
```

---

# 👥 User Guide

## User Roles & Permissions

### Administrator
- Full access to all features
- Can create and manage users
- Approve purchase requests
- View all reports and analytics
- Manage system settings

### Staff/Teacher
- View assigned assets
- Submit repair requests
- Create purchase requests
- View room assignments
- Update asset status

## Navigation Guide

### Main Menu Items

| Icon | Page | Description |
|------|------|-------------|
| 📊 | Dashboard | Overview of all assets and statistics |
| 📦 | Assets | Complete list of all school assets |
| 📋 | Stock Management | Inventory control and tracking |
| 🏢 | Room Assets | Assets organized by location |
| 🔧 | Repair History | Equipment maintenance records |
| ⚠️ | Low Stock Alerts | Items needing restock |
| 🛒 | Purchase Requests | Procurement management |

## Key Concepts

### Assets
Physical items owned by the school
- **Examples:** Computers, desks, projectors
- **Tracked by:** Individual item or quantity

### Stock
Consumable supplies tracked by quantity
- **Examples:** Paper, markers, cleaning supplies
- **Alerts:** When quantity falls below threshold

### Rooms
Physical locations in the school
- **Examples:** Classroom 101, Science Lab, Office
- **Purpose:** Organize and locate assets

### Repairs
Maintenance records for equipment
- **Status:** Reported → In Repair → Completed
- **Tracks:** Issue, date, resolution

## Daily Workflow

### Morning Routine
1. Check dashboard for overnight alerts
2. Review pending notifications
3. Check low stock items

### Midday Tasks
1. Process pending purchase requests
2. Update asset statuses
3. Respond to repair requests

### Afternoon Activities
1. Update repair statuses
2. Add new assets if received
3. Assign assets to rooms

### Evening Review
1. Review stock levels
2. Check pending approvals
3. Plan next day's tasks

## Best Practices

### For Best Results
1. ✅ Set realistic stock thresholds
2. ✅ Update asset status immediately
3. ✅ Check alerts daily
4. ✅ Document repairs thoroughly
5. ✅ Keep room assignments current

### Common Mistakes to Avoid
1. ❌ Forgetting to configure Firebase
2. ❌ Not setting stock thresholds
3. ❌ Ignoring low stock alerts
4. ❌ Incomplete repair documentation
5. ❌ Outdated room assignments

---

# 🐛 Troubleshooting

## Common Issues and Solutions

### Issue: Application won't start

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm start
```

### Issue: Firebase connection error

**Solution:**
- Verify Firebase configuration in `frontend/src/firebase/config.js`
- Check internet connection
- Ensure Firebase project is active
- Verify API key is correct
- Check Firebase Console for project status

### Issue: Login not working

**Solution:**
- Ensure Email/Password authentication is enabled in Firebase Console
- Check browser console for error messages
- Verify user exists in Firebase Authentication
- Clear browser cache and cookies
- Try incognito/private browsing mode

### Issue: Port 3000 already in use

**Solution:**
```bash
# Option 1: Use different port
set PORT=3001 && npm start

# Option 2: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: Build fails

**Solution:**
```bash
# Update dependencies
npm update

# Clear build cache
rmdir /s /q build
npm run build

# If still fails, reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
```

### Issue: Data not loading

**Solution:**
- Check browser console for errors
- Verify Firebase Firestore rules allow read/write
- Check internet connection
- Verify user is authenticated
- Check Firebase Console for database status

### Issue: Assets not saving

**Solution:**
- Check Firebase Firestore rules
- Verify all required fields are filled
- Check browser console for validation errors
- Ensure user has write permissions
- Check Firebase quota limits

### Issue: Alerts not showing

**Solution:**
- Verify stock thresholds are set
- Check alert calculation logic
- Refresh the page
- Clear browser cache
- Check Firebase data structure

## Browser Compatibility

### Supported Browsers
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

### Minimum Versions
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Performance Tips

### For Better Performance
1. Clear browser cache regularly
2. Use latest browser version
3. Close unnecessary tabs
4. Check internet speed
5. Optimize Firebase queries

### If App is Slow
1. Check network connection
2. Clear browser cache
3. Restart browser
4. Check Firebase usage limits
5. Optimize data queries

## Getting Help

### Before Asking for Help
1. ✅ Check this troubleshooting section
2. ✅ Review browser console errors
3. ✅ Check Firebase Console
4. ✅ Verify all configuration steps
5. ✅ Try in different browser

### Information to Provide
- Error message (exact text)
- Browser and version
- Steps to reproduce
- Screenshots if applicable
- Console error logs

---

# 📞 Additional Resources

## Online Documentation
- **Firebase:** https://firebase.google.com/docs
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **AG Grid:** https://www.ag-grid.com/react-data-grid/
- **Recharts:** https://recharts.org/

## Useful Commands

### Development
```bash
npm start              # Start development server
npm run build          # Create production build
npm test               # Run tests
npm run test:coverage  # Run tests with coverage
```

### Deployment
```bash
npm run build          # Build for production
npm run deploy         # Deploy to GitHub Pages
serve -s build         # Serve production build locally
```

### Maintenance
```bash
npm update             # Update dependencies
npm audit              # Check for vulnerabilities
npm audit fix          # Fix vulnerabilities
npm cache clean --force # Clear npm cache
```

## File Locations Quick Reference

### Need to change...

**Navigation Menu** → `src/components/common/Sidebar.jsx`

**Top Bar** → `src/components/common/Navbar.jsx`

**Login Page** → `src/pages/SignIn.jsx`

**Dashboard** → `src/pages/Dashboard.jsx`

**Asset Management** → `src/pages/AssetList.jsx`

**Firebase Settings** → `src/firebase/config.js`

**User Authentication** → `src/context/AuthContext.jsx`

**App Routes** → `src/App.jsx`

**Colors/Theme** → `src/styles/globals.css` or `tailwind.config.js`

**App Logo** → `public/logo.svg`

**Page Title** → `public/index.html`

---

# 🎓 Learning Path

## Week 1: Setup & Basics
- **Day 1:** Install and configure
- **Day 2:** Explore dashboard and navigation
- **Day 3:** Learn asset management
- **Day 4:** Practice stock management
- **Day 5:** Test all features

## Week 2: Advanced Features
- **Day 1:** Master repair tracking
- **Day 2:** Handle purchase requests
- **Day 3:** Configure alerts and thresholds
- **Day 4:** Room assignment strategies
- **Day 5:** Generate reports and analytics

## Week 3: Administration
- **Day 1:** User management
- **Day 2:** System configuration
- **Day 3:** Data backup strategies
- **Day 4:** Performance optimization
- **Day 5:** Training others

---

# 📝 Version History

- **v1.0.0** - Initial release with core features

---

# 📄 License

This project is for educational purposes.

---

**Last Updated:** 2024  
**Developed for:** School Asset Management  
**Status:** ✅ Production Ready

---

## 🎉 You're All Set!

This complete documentation contains everything you need to:
- ✅ Set up the application
- ✅ Understand the project structure
- ✅ Learn all workflows
- ✅ Use the system effectively
- ✅ Troubleshoot issues

**Start with the Quick Start section and refer back to specific sections as needed!**
