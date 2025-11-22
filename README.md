# JeevBandhu: Livestock Health Management Platform

A full-stack web application for tracking livestock health and ensuring bio-safe marketplace transactions.

## Features

- **Digital Health Passport**: Track individual animal health status and medical history
- **Bio-Safety Engine**: Automatic withdrawal period enforcement
- **Verified Marketplace**: Only bio-safe products can be listed
- **Transparency**: Complete medical history traceability for buyers

## Tech Stack

- **Frontend**: EJS templates, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Native Driver)
- **Session Management**: express-session with MongoDB store

## Project Structure

```
REPOGENESIS/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Collection helper functions
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth & bio-safety middleware
│   ├── utils/           # Helper utilities
│   └── server.js        # Main server file
├── frontend/
│   ├── views/           # EJS templates
│   ├── public/          # Static assets (CSS, JS)
│   └── src/             # Source CSS for Tailwind
└── .env.example         # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the MongoDB connection string and session secret.

### 3. Build Frontend Assets

```bash
cd frontend
npm run build
```

### 4. Start the Server

```bash
cd backend
npm start
```

The application will run on `http://localhost:3000`

## Usage

### For Farmers
1. Register as a farmer
2. Add animals to your herd with unique tag IDs
3. Log medical treatments (system automatically calculates withdrawal periods)
4. List products only when animals are in HEALTHY status

### For Buyers
1. Register as a buyer
2. Browse the marketplace
3. View bio-link transparency data for each product
4. Make informed purchasing decisions

## Key Concepts

### Three Pillars

1. **Digital Health Passport**: Every animal has a unique profile with complete medical history
2. **Bio-Safety Engine**: Deterministic withdrawal period calculation and enforcement
3. **Trust-Verified Marketplace**: Only products from healthy animals can be listed

### Animal Status States

- `HEALTHY`: Ready for production, can list products
- `WITHDRAWAL_LOCK`: Under medication withdrawal period, cannot list products  
- `QUARANTINE`: Isolated for health reasons

## License

ISC
