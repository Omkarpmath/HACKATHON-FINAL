# 🐄 JeevBandhu: Livestock Health Management Platform

## 🌐 Live Application

> **🚀 Deployed URL**: https://jeev-bandhu.onrender.com

---
**JeevBandhu** (Sanskrit: *जीवबन्धु* - "Friend of Life") is a comprehensive livestock health management platform designed to revolutionize animal healthcare, marketplace transparency, and bio-safety compliance in the agricultural sector.

> 🌟 **Mission**: Empowering farmers with AI-driven health insights and ensuring bio-safe, transparent marketplace transactions for healthier livestock and safer food supply chains.

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Usage Guide](#-usage-guide)
- [Key Concepts](#-key-concepts)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Support](#-support)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🏥 Digital Health Passport
- **Individual Animal Tracking**: Unique tag IDs for each animal with comprehensive health profiles
- **Medical History**: Complete treatment records, vaccinations, and medication logs
- **Real-time Health Status**: Dynamic status tracking (HEALTHY, WITHDRAWAL_LOCK, QUARANTINE)
- **Automated Withdrawal Periods**: Intelligent calculation and enforcement of medication withdrawal times

### 🤖 AI-Powered Insights
- **Disease Diagnosis**: AI-driven symptom analysis using Mistral 7B Instruct model
- **Personalized Health Plans**: Custom nutrition and wellness recommendations
- **RAG-Based Guidance**: Retrieval-Augmented Generation for veterinary knowledge base
- **Preventive Care Suggestions**: Proactive health management recommendations

### 🛡️ Bio-Safety Engine
- **Automatic Compliance**: Withdrawal period enforcement to prevent contaminated products
- **Status-Based Restrictions**: Products can only be listed when animals are HEALTHY
- **Transparency Reports**: Complete medical history accessible to buyers
- **Trust Verification**: Bio-safe marketplace with full traceability

### 🛒 Verified Marketplace
- **Product Listings**: Sell livestock products (milk, eggs, meat, etc.)
- **Bio-Link Transparency**: View complete animal health history before purchase
- **Order Management**: Track orders, sales, and delivery status
- **Farmer & Buyer Dashboards**: Role-based interfaces for different user types

### 👥 Community Features
- **Discussion Forums**: Knowledge sharing among farmers
- **Expert Q&A**: Post questions and get community answers
- **Best Practices**: Learn from experienced farmers
- **Search & Filter**: Find relevant discussions by category

### 📊 Analytics & Reporting
- **Health Metrics**: Track herd health trends over time
- **Sales Performance**: Monitor marketplace activity and revenue
- **Compliance Reports**: Bio-safety adherence tracking
- **Medical Treatment Analysis**: Identify patterns and optimize care

---

## 🎥 Demo

> **Live Demo**: [Coming Soon]

### Screenshots

*Add screenshots of your application here*

---

## 🛠️ Tech Stack

### Frontend
- **Template Engine**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **JavaScript**: Vanilla JS for interactivity

### Backend
- **Runtime**: Node.js 16.x+
- **Framework**: Express.js
- **Database**: MongoDB (Native Driver)
- **Session Management**: express-session with MongoDB store
- **Authentication**: Session-based authentication with bcrypt

### AI/ML
- **Model**: Mistral 7B Instruct v0.2 (via Hugging Face Inference API)
- **Features**: Disease diagnosis, health plan generation, RAG-based guidance

### DevOps
- **Process Manager**: Nodemon (development)
- **File Uploads**: Multer
- **PDF Processing**: pdf-parse

---

## 🏗️ Project Architecture

```
JEEVBANDHU/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── models/
│   │   ├── users.js               # User collection helpers
│   │   ├── animals.js             # Animal collection helpers
│   │   ├── medical.js             # Medical records helpers
│   │   ├── products.js            # Product listings helpers
│   │   ├── orders.js              # Order management helpers
│   │   └── ...                    # Other collection helpers
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── animals.js             # Animal management routes
│   │   ├── medical.js             # Medical records routes
│   │   ├── marketplace.js         # Marketplace routes
│   │   ├── orders.js              # Order management routes
│   │   ├── ai.js                  # AI-powered features
│   │   ├── community.js           # Community forum routes
│   │   ├── guide.js               # RAG-based guidance
│   │   └── compliance.js          # Compliance checking
│   ├── middleware/
│   │   ├── auth.js                # Authentication middleware
│   │   └── biosafety.js           # Bio-safety validation
│   ├── utils/
│   │   ├── withdrawalCalculator.js # Withdrawal period logic
│   │   └── ...                     # Other utility functions
│   ├── scripts/
│   │   └── initDB.js              # Database initialization
│   ├── .env.example               # Environment variables template
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Main server entry point
│
├── frontend/
│   ├── views/
│   │   ├── auth/
│   │   │   ├── register.ejs       # Registration page
│   │   │   └── login.ejs          # Login page
│   │   ├── farmer/
│   │   │   ├── dashboard.ejs      # Farmer dashboard
│   │   │   ├── animals.ejs        # Animal management
│   │   │   ├── medical.ejs        # Medical records
│   │   │   ├── health-plan.ejs    # AI health plans
│   │   │   ├── sales.ejs          # Sales dashboard
│   │   │   └── ...
│   │   ├── marketplace/
│   │   │   ├── index.ejs          # Marketplace listing
│   │   │   ├── product.ejs        # Product details
│   │   │   └── orders.ejs         # Order history
│   │   ├── layout.ejs             # Main layout template
│   │   └── index.ejs              # Landing page
│   ├── public/
│   │   └── css/
│   │       └── output.css         # Compiled Tailwind CSS
│   ├── src/
│   │   └── input.css              # Tailwind source CSS
│   ├── package.json               # Frontend dependencies
│   └── tailwind.config.js         # Tailwind configuration
│
├── package.json                   # Root package.json (install scripts)
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
├── SETUP.md                       # Detailed setup guide
└── BUG_REPORT.md                  # Bug report template
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6.x or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud-based)
- **Git** - [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/jeevbandhu.git
cd jeevbandhu
```

2. **Install dependencies**

The project uses a convenient installation script that installs both backend and frontend dependencies:

```bash
npm install
```

This runs the `postinstall` script which:
- Installs backend dependencies
- Installs frontend dependencies
- Builds Tailwind CSS assets

Alternatively, you can install manually:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
npm run build
```

### Configuration

1. **Set up environment variables**

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

2. **Configure your `.env` file**

Open `backend/.env` and update the following values:

```env
# HUGGING FACE API CONFIGURATION (REQUIRED)
# Get your API key from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=your_actual_huggingface_api_key

# DATABASE CONFIGURATION
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/jeevbandhu
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jeevbandhu

# SESSION CONFIGURATION
SESSION_SECRET=your_super_secret_random_string_here

# SERVER CONFIGURATION
PORT=3000
NODE_ENV=development
```

3. **Get a Hugging Face API Key** (Required for AI features)

- Visit [Hugging Face](https://huggingface.co/settings/tokens)
- Create a free account if you don't have one
- Generate a new Access Token
- Copy the token to your `.env` file

### Running the Application

1. **Start MongoDB** (if running locally)

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

2. **Initialize the database** (optional, first time only)

```bash
cd backend
node scripts/initDB.js
```

3. **Start the application**

**Development mode** (with auto-reload):

```bash
cd backend
npm run dev
```

**Production mode**:

```bash
npm start
```

Or from the root directory:

```bash
npm start
```

4. **Access the application**

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📖 Usage Guide

### For Farmers

1. **Register an account**
   - Navigate to `/register`
   - Select "Farmer" as user type
   - Fill in your details

2. **Add animals to your herd**
   - Go to Dashboard → Animals
   - Click "Add New Animal"
   - Provide unique tag ID and animal details

3. **Log medical treatments**
   - Select an animal → Medical Records
   - Add treatments, medications, vaccinations
   - System automatically calculates withdrawal periods

4. **Use AI Health Features**
   - Diagnose diseases based on symptoms
   - Generate personalized nutrition and health plans
   - Access RAG-based veterinary guidance

5. **List products in marketplace**
   - Products can only be listed from HEALTHY animals
   - Set prices, descriptions, and quantities
   - Track orders and sales

### For Buyers

1. **Register an account**
   - Navigate to `/register`
   - Select "Buyer" as user type

2. **Browse the marketplace**
   - View all available products
   - Filter by category, price, location

3. **Check bio-link transparency**
   - Click on any product to view full animal health history
   - Verify bio-safety compliance
   - Make informed purchasing decisions

4. **Place orders**
   - Add products to cart
   - Complete purchase
   - Track order status

### For Community

- **Post questions** in the community forum
- **Search discussions** by category
- **Share knowledge** and best practices
- **Connect with other farmers**

---

## 🔑 Key Concepts

### Animal Health Status

JeevBandhu uses three primary status states:

| Status | Description | Can List Products? |
|--------|-------------|-------------------|
| **HEALTHY** | Animal is in good health, no active treatments | ✅ Yes |
| **WITHDRAWAL_LOCK** | Animal is under medication withdrawal period | ❌ No |
| **QUARANTINE** | Animal is isolated for health reasons | ❌ No |

### Bio-Safety Engine

The Bio-Safety Engine ensures marketplace integrity through:

1. **Automatic Withdrawal Calculation**: Based on medication type and dosage
2. **Real-time Status Updates**: Dynamic status changes based on withdrawal periods
3. **Listing Restrictions**: Products blocked until animals are HEALTHY
4. **Transparency Enforcement**: Complete medical history available to buyers

### Three Pillars

1. **Digital Health Passport**: Every animal has a unique profile with complete medical history
2. **Bio-Safety Engine**: Deterministic withdrawal period calculation and enforcement
3. **Trust-Verified Marketplace**: Only products from healthy animals can be listed

---

## 📡 API Documentation

### Authentication

```javascript
POST /auth/register     - Register new user
POST /auth/login        - Login user
GET  /auth/logout       - Logout user
```

### Animals

```javascript
GET    /animals              - Get all animals for logged-in farmer
POST   /animals              - Add new animal
GET    /animals/:id          - Get animal details
PUT    /animals/:id          - Update animal details
DELETE /animals/:id          - Delete animal
```

### Medical Records

```javascript
GET    /medical/:animalId           - Get medical history
POST   /medical/:animalId           - Add medical record
PUT    /medical/:animalId/:recordId - Update medical record
DELETE /medical/:animalId/:recordId - Delete medical record
```

### Marketplace

```javascript
GET    /marketplace              - Browse all products
GET    /marketplace/:id          - Get product details
POST   /marketplace              - Create product listing
PUT    /marketplace/:id          - Update product listing
DELETE /marketplace/:id          - Delete product listing
```

### AI Features

```javascript
POST /ai/diagnose        - AI disease diagnosis
POST /ai/health-plan     - Generate health plan
POST /ai/guide           - RAG-based guidance
```

### Orders

```javascript
GET    /orders               - Get user orders
POST   /orders               - Create new order
GET    /orders/:id           - Get order details
PUT    /orders/:id/status    - Update order status
```

*For detailed API documentation, see [API.md](API.md) (coming soon)*

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** using the [Bug Report Template](BUG_REPORT.md)
- 💡 **Suggest features** by opening an issue
- 📖 **Improve documentation**
- 🔧 **Submit pull requests**

### Development Workflow

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
```bash
npm run dev
# Test all affected features
```

5. **Commit your changes**
```bash
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and address feedback

### Code Style

- Use **ES6+** syntax
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes
- Include **JSDoc comments** for functions
- Keep functions **small and focused**
- Write **meaningful commit messages**

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Digital Health Passport
- ✅ Bio-Safety Engine
- ✅ Verified Marketplace
- ✅ AI-powered diagnosis and health plans
- ✅ Community forum
- ✅ Session-based authentication

### Version 1.1 (Planned)
- [ ] Mobile application (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Veterinary expert verification system
- [ ] SMS/Email notifications
- [ ] Export health reports as PDF

### Version 2.0 (Future)
- [ ] Insurance integration
- [ ] Government compliance reporting
- [ ] Blockchain-based health records
- [ ] IoT device integration (wearables for animals)
- [ ] Predictive health analytics
- [ ] Supply chain tracking

### Long-term Vision
- [ ] Global livestock health database
- [ ] Disease outbreak prediction
- [ ] Farm management integration
- [ ] AI-powered breeding recommendations

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 JeevBandhu Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💬 Support

### Getting Help
- 📖 **Documentation**: Check this README and [SETUP.md](SETUP.md)
- 🐛 **Bug Reports**: Use the [BUG_REPORT.md](BUG_REPORT.md) template
- 💡 **Feature Requests**: Open an issue with the `enhancement` label
- 💬 **Discussions**: Join our [Discussions](https://github.com/yourusername/jeevbandhu/discussions)

## 🙏 Acknowledgments

This project was built with the help of:

- **Hugging Face** - For providing the Mistral 7B model API
- **MongoDB** - For the robust database solution
- **Express.js** - For the excellent web framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Chart.js** - For beautiful data visualizations
- **All contributors** - Omkar Pashupatimath, Abhilash Arya, Parth Bhat, Abhigyan Shekhar

### Inspiration

JeevBandhu was inspired by the need to:
- Improve livestock health management in rural areas
- Ensure food safety through transparent supply chains
- Empower farmers with AI-powered insights
- Build trust between farmers and consumers

---
<div align="center">

**Made with ❤️ by the JeevBandhu Team**

⭐ **Star this repository if you find it helpful!** ⭐

[Report Bug](https://github.com/omkarpmath/jeevbandhu/issues) · [Request Feature](https://github.com/omkarpmath/jeevbandhu/issues) · [Documentation](https://github.com/omkarpmath/jeevbandhu/wiki)

</div>
