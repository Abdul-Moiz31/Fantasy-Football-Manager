# 🏈 Fantasy Football Manager

A modern, full-stack fantasy football management application that allows users to create teams, manage budgets, and trade players in an interactive transfer market. Built with React, TypeScript, Node.js, and modern development practices.

## 📋 Project Overview

Fantasy Football Manager is a comprehensive web application that simulates the experience of managing a professional football team. Users can register, create teams, buy/sell players, manage budgets, and compete in a dynamic transfer market with real player data and constraints.

## 🔧 Installation & Setup Guide

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm 9+** or **yarn** package manager
- **Git** for version control

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/fantasy-football-manager.git
cd fantasy-football-manager
```

### Step 2: Install Dependencies
```bash
# Install all dependencies for both client and server
npm install

# Or install individually
cd client && npm install
cd ../server && npm install
```

### Step 3: Environment Configuration

#### Server Environment (.env)
Create `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here-min-32-chars

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Database Configuration (if using Prisma with database)
DATABASE_URL="mysql://root:password@localhost:3306/fantasy_football"
```

#### Client Environment (.env)
Create `client/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Fantasy Football Manager
VITE_APP_VERSION=1.0.0
```

### Step 4: Database Setup (Optional)
If using database instead of JSON files:
```bash
cd server
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Step 5: Development Server
```bash
# Start both client and server concurrently
npm run dev

# Or start individually
npm run dev:client    # Frontend on http://localhost:3000
npm run dev:server    # Backend on http://localhost:5000
```

### Step 6: Production Build
```bash
# Build both applications
npm run build

# Start production server
npm run start
```
## ⏱️ Development Time Report

**Total Development Time: 19-20 Hours**

### Phase 1: Backend Development (9-10 Hours)
- **Project setup & architecture** (2 hours)
  - Express.js server setup with TypeScript
  - Database schema design and migrations
  - Environment configuration
- **Authentication system** (2.5 hours)
  - JWT implementation
  - User registration/login
  - Password hashing with bcryptjs
  - Protected route middleware
- **Team management APIs** (2.5 hours)
  - Team creation with Worker Threads
  - Player addition/removal validation
  - Budget management system
  - Position constraints implementation
- **Market system** (2 hours)
  - Transfer market APIs
  - Player filtering and search
  - Buy/sell transaction logic
  - Market fee calculations

### Phase 2: Frontend Development (8-9 Hours)
- **React app setup & routing** (1.5 hours)
  - Vite configuration
  - React Router setup
  - TypeScript configuration
- **State management & contexts** (2 hours)
  - Authentication context
  - Team management context
  - Market context with filtering
- **UI component development** (2.5 hours)
  - Design system components
  - Responsive layout system
  - Reusable form components
  - Toast notification system
- **Page implementation** (2-2.5 hours)
  - Dashboard page with team overview
  - Transfer market with advanced filters
  - Team management interface
  - Authentication flow

### Phase 3: Integration & Polish (2 Hours)
- **API integration** (1 hour)
  - Frontend-backend communication
  - Error handling implementation
  - Loading states
- **Testing & bug fixes** (1 hour)
  - End-to-end testing
  - UI responsiveness fixes
  - Performance optimizations

## 🖼️ User Interface Screenshots

### 🔐 Authentication Page
![Authentication Page](client/public/auth.png)
*Secure login and registration interface with clean, modern design*

### 🏠 Dashboard
![Dashboard](client/public/main.png)
*Main dashboard showing team overview, statistics, and navigation*

### ⚽ Team Management
![Team Management](client/public/team.png)
*Comprehensive team management with player details and budget tracking*

### 🛒 Transfer Market
![Transfer Market](client/public/market%20list.png)
*Interactive marketplace with advanced filtering and search capabilities*

### 📋 My Listings
![My Listings](client/public/my%20list.png)
*Player listing management with sell/remove functionality*

## 🚀 Key Features

### 🔐 Authentication & User Management
- **Secure Registration/Login** with JWT tokens
- **Email-based authentication** with bcrypt password hashing
- **Automatic token validation** and refresh
- **Protected routes** 

### ⚽ Team Management
- **Dynamic team creation** using Node.js Worker Threads
- **Position-based constraints** (Goalkeepers, Defenders, Midfielders, Forwards)
- **Budget management** with realistic player valuations
- **Real-time team composition** validation
- **Player listing/removal** from teams

### 🛒 Transfer Market
- **Interactive marketplace** with 500+ real players
- **Advanced filtering** by Name, team, price range, 
- **Real-time search** with debounced input
- **Buy/sell confirmation** with budget validation

### 💰 Budget System
- **Initial budget** of 5M for new teams
- **Dynamic pricing** based on player positions and ratings
- **Transaction validation** to prevent overspending
- **Budget tracking** across all operations

### 🎨 Modern UI/UX
- **Responsive design** for mobile and desktop
- **Clean, modern interface** with Tailwind CSS
- **Position-based color coding** for easy identification
- **Loading states** and error handling
- **Toast notifications** for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router Dom** for client-side routing
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **Lucide React** for icons
- **React Context API** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Worker Threads** for async operations
- **Prisma Client** for database operations
- **JSON file storage** for data persistence

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Git** for version control
- **npm/yarn** for package management

## 📂 Project Structure

```
fantasy-football-manager/
├── 📁 client/                          # React frontend application
│   ├── 📁 public/
│   │   └── football.svg                # App logo and favicon
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   ├── 📁 ui/                  # Base UI components (Button, Card, Modal, etc.)
│   │   │   ├── 📁 layouts/             # Layout components (DashboardLayout, BaseLayout)
│   │   │   ├── 📁 forms/               # Form components (LoginForm)
│   │   │   ├── 📁 auth/                # Authentication components
│   │   │   ├── 📁 navigation/          # Navigation components (Header, Sidebar)
│   │   │   └── 📁 loaders/             # Loading state components
│   │   ├── 📁 pages/                   # Page components
│   │   │   ├── AuthPage.tsx            # Login/Register page
│   │   │   ├── HomePage.tsx            # Dashboard page
│   │   │   ├── TeamPage.tsx            # Team management page
│   │   │   └── MarketPage.tsx          # Transfer market page
│   │   ├── 📁 contexts/                # React Context providers
│   │   │   ├── AuthContext.tsx         # Authentication state
│   │   │   ├── TeamContext.tsx         # Team management state
│   │   │   └── MarketContext.tsx       # Market data state
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   │   ├── useApiCall.ts           # API call management
│   │   │   ├── useApiError.ts          # Error handling
│   │   │   ├── useConfirmModal.ts      # Modal confirmations
│   │   │   ├── useTeamConstraints.ts   # Team validation logic
│   │   │   ├── useDebounce.ts          # Input debouncing
│   │   │   └── use-toast.ts           # Toast notifications
│   │   ├── 📁 services/
│   │   │   └── api.ts                  # Axios API service layer
│   │   ├── 📁 interfaces/
│   │   │   └── index.ts                # TypeScript type definitions
│   │   ├── 📁 utils/
│   │   │   └── index.ts                # Utility functions
│   │   ├── 📁 constants/
│   │   │   └── index.ts                # App constants and routes
│   │   ├── App.tsx                     # Main app component
│   │   └── main.tsx                    # App entry point
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.ts                  # Vite configuration
├── 📁 server/                          # Node.js backend application
│   ├── 📁 src/
│   │   ├── 📁 controllers/             # API route handlers
│   │   │   ├── authController.ts       # Authentication logic
│   │   │   ├── teamsController.ts      # Team management logic
│   │   │   ├── marketController.ts     # Market operations logic
│   │   │   └── playersController.ts    # Player data logic
│   │   ├── 📁 routes/                  # Express route definitions
│   │   │   ├── auth.ts                 # Authentication routes
│   │   │   ├── teams.ts                # Team management routes
│   │   │   ├── market.ts               # Market routes
│   │   │   └── players.ts              # Player routes
│   │   ├── 📁 middleware/
│   │   │   └── auth.ts                 # JWT authentication middleware
│   │   ├── 📁 services/
│   │   │   └── DbService.ts            # Database service layer
│   │   ├── 📁 workers/
│   │   │   └── teamCreationWorker.js   # Worker thread for team creation
│   │   ├── 📁 interfaces/
│   │   │   └── index.ts                # Backend type definitions
│   │   ├── 📁 constants/
│   │   │   └── index.ts                # Team constraints and app constants
│   │   ├── 📁 enums/
│   │   │   └── index.ts                # HTTP status codes and enums
│   │   ├── 📁 utils/
│   │   │   └── index.ts                # Backend utilities
│   │   ├── server.ts                   # Express app configuration
│   │   └── index.ts                    # Server entry point
│   ├── 📁 prisma/                      # Database schema and migrations
│   │   ├── 📁 migrations/              # Database migration files
│   │   ├── schema.prisma               # Database schema definition
│   │   └── seed.ts                     # Database seeding script
│   ├── package.json                    # Backend dependencies
│   └── tsconfig.json                   # TypeScript configuration
├── 📁 data/                            # JSON data storage
│   └── players.json                    # Player database (500+ players)
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

## 📊 Application Flow Diagram

```mermaid
flowchart TD
    A[User visits app] --> B{Authenticated?}
    B -->|No| C[Show Login/Register Page]
    B -->|Yes| D[Show Dashboard]
    
    C --> E[User enters credentials]
    E --> F{Valid credentials?}
    F -->|No| G[Show error message] --> C
    F -->|Yes| H{New user?}
    H -->|Yes| I[Create team with Worker Thread]
    H -->|No| J[Load existing team]
    
    I --> K[Assign random players]
    I --> L[Set initial budget 5M]
    K --> M[Team creation complete]
    L --> M
    M --> D
    J --> D
    
    D --> N{User selects page}
    N -->|Dashboard| O[Show team overview & stats]
    N -->|Market| P[Show transfer market]
    N -->|Team| Q[Show team management]
    
    P --> R[Load all players]
    R --> S[Apply filters & search]
    S --> T[Display filtered results]
    T --> U{User wants to buy?}
    U -->|Yes| V[Check budget & team constraints]
    V -->|Valid| W[Process purchase]
    V -->|Invalid| X[Show error message]
    W --> Y[Update budget & team]
    Y --> Z[Show success message]
    
    Q --> AA[Show current team]
    AA --> BB{User wants to sell?}
    BB -->|Yes| CC[Check minimum team size]
    CC -->|Valid| DD[List player on market]
    CC -->|Invalid| EE[Show constraint error]
    DD --> FF[Update team & add to market]
    FF --> GG[Show success message]
    
    O --> HH[Display team composition]
    HH --> II[Show position distribution]
    II --> JJ[Display budget status]
    
    style A fill:#e1f5fe
    style D fill:#c8e6c9
    style W fill:#ffecb3
    style DD fill:#ffecb3
 ```
 
 ## 🏗️ How The Worker Works

### 1. User Authentication Flow
- Users register with email/password
- JWT tokens issued for authenticated sessions
- Tokens validated on protected routes
- Automatic token refresh and logout handling

### 2. Team Creation Process
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant W as Worker Thread
    participant D as Data Store

    U->>C: Register new account
    C->>S: POST /api/auth (register)
    S->>S: Create user account
    S->>W: Start team creation worker
    W->>D: Load player database
    W->>W: Select random players by position
    W->>D: Create team with selected players
    W->>S: Team creation complete
    S->>C: Return user + team data
    C->>U: Show dashboard with new team
```



## 🔄 API Endpoints

### Authentication
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth` | Login/Register user | ❌ |
| GET | `/api/auth/validate` | Validate JWT token | ✅ |

### Teams
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/teams` | Create new team | ✅ |
| GET | `/api/teams/my-team` | Get user's team | ✅ |
| GET | `/api/teams` | Get all teams | ✅ |
| POST | `/api/teams/add-player` | Add player to team | ✅ |
| DELETE | `/api/teams/remove-player/:id` | Remove player from team | ✅ |

### Market
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/api/market/players` | Get market listings | ✅ |
| POST | `/api/market/sell` | List player for sale | ✅ |
| POST | `/api/market/buy` | Buy player from market | ✅ |
| DELETE | `/api/market/remove/:id` | Remove listing from market | ✅ |

### Players
| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| GET | `/api/players` | Get all players | ✅ |
| GET | `/api/players/:id` | Get specific player | ✅ |



## 📝 License
