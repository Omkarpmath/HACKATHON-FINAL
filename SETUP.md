# Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works)

## Setup Steps

### 1. Configure MongoDB Atlas

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Set role to "Read and write to any database"
4. Whitelist your IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development, you can use `0.0.0.0/0` (allow from anywhere)
5. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### 2. Configure Environment Variables

The `.env` file has been created for you. Edit it and replace these values:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/jeevbandhu?retryWrites=true&w=majority
SESSION_SECRET=generate-a-random-secret-string-here
PORT=3000
NODE_ENV=development
```

**Important**: Replace in the MONGODB_URI:
- `YOUR_USERNAME` - your MongoDB username
- `YOUR_PASSWORD` - your MongoDB password
- `YOUR_CLUSTER` - your cluster name (from connection string)

### 3. Start the Server

```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB Atlas
✅ Database indexes created
✅ JeevBandhu server running on http://localhost:3000
```

### 4. Open in Browser

Visit: `http://localhost:3000`

## Quick Test

### As a Farmer
1. Click "Get Started" → Select "Farmer" role
2. Register with email and password
3. Add your first animal (e.g., Tag ID: "IND-COW-001")
4. Click "Add Medicine" and select a medicine
5. Notice the withdrawal warning modal
6. Confirm and see the animal lock with countdown

### As a Buyer
1. Open incognito/private window
2. Register as "Buyer"
3. Browse marketplace
4. Click "View Bio-Link" on any product
5. See complete medical transparency

## Common Issues

### "MongoDB connection failed"
- Check your connection string in `.env`
- Verify username/password are correct
- Ensure IP is whitelisted in MongoDB Atlas

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Or kill the process using port 3000

### CSS not loading
- Make sure you ran the Tailwind build:
  ```bash
  cd frontend
  npm run build
  ```

## Development Mode

For auto-restart on file changes:

```bash
cd backend
npm run dev
```

## What's Next?

- Add more animals to your herd
- Test the bio-safety locking mechanism
- Create product listings
- View transparency in marketplace

For full documentation, see [README.md](file:///Volumes/Omkar/REPOGENESIS/README.md)
