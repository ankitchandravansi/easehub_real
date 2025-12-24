# EaseHub - MongoDB Atlas Setup Guide

## 🎯 Quick Start with MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project named "EaseHub"

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "easehub-cluster")
5. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `easehub_admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP address
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string

It will look like:
```
mongodb+srv://easehub_admin:<password>@easehub-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Configure Backend
1. Open `backend/.env` file
2. Replace the MONGODB_URI with your connection string
3. Replace `<password>` with your actual database user password
4. Add the database name after `.net/`: `/easehub`

Final format:
```
MONGODB_URI=mongodb+srv://easehub_admin:YOUR_PASSWORD@easehub-cluster.xxxxx.mongodb.net/easehub?retryWrites=true&w=majority
```

### Step 7: Seed the Database
```bash
cd backend
npm run seed
```

This will create:
- Admin user (admin@easehub.com / Admin@123)
- Sample PG listings
- Sample meal plans
- Sample laundry services

### Step 8: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔒 Security Best Practices

### For Production:
1. **Never commit .env file** - It's already in .gitignore
2. **Use strong passwords** - Minimum 16 characters
3. **Rotate JWT secrets** - Change regularly
4. **Whitelist specific IPs** - Don't use 0.0.0.0/0 in production
5. **Enable MongoDB encryption** - Use Atlas encryption at rest
6. **Use environment variables** - For all sensitive data

### Environment Variables Checklist:
- ✅ MONGODB_URI - Your Atlas connection string
- ✅ JWT_SECRET - Strong random string (min 32 chars)
- ✅ NODE_ENV - Set to 'production' for production
- ✅ PORT - Server port (default 5000)

## 📊 Verify Connection

After starting the backend, you should see:
```
✅ MongoDB Connected: easehub-cluster-shard-00-00.xxxxx.mongodb.net
📊 Database: easehub
✅ Mongoose connected to MongoDB
🚀 Server running on port 5000 in development mode
```

## 🚨 Troubleshooting

### Connection Timeout
- Check if your IP is whitelisted
- Verify username and password are correct
- Ensure connection string format is correct

### Authentication Failed
- Double-check database user credentials
- Verify user has correct permissions

### Database Not Found
- Ensure database name is in connection string
- Run seed script to create initial data

## 🌐 Production Deployment

### MongoDB Atlas Production Checklist:
- [ ] Create dedicated production cluster
- [ ] Use M10+ tier for production workloads
- [ ] Enable backup and point-in-time recovery
- [ ] Set up monitoring and alerts
- [ ] Configure IP whitelist for production servers
- [ ] Use separate database users for different environments
- [ ] Enable audit logs
- [ ] Set up connection pooling

### Recommended Atlas Configuration:
- **Cluster Tier**: M10 or higher
- **Backup**: Continuous backup enabled
- **Monitoring**: Enable performance advisor
- **Alerts**: Set up for connection issues, high CPU, disk usage
- **Regions**: Multi-region for high availability

## 📈 Scaling Considerations

As your user base grows:
1. **Upgrade cluster tier** - M10 → M20 → M30
2. **Enable sharding** - For horizontal scaling
3. **Add read replicas** - For read-heavy workloads
4. **Implement caching** - Redis for frequently accessed data
5. **Optimize indexes** - Use Atlas Performance Advisor

## 💡 Tips

- Use MongoDB Compass to visualize your data
- Enable Atlas Search for advanced search features
- Set up Atlas Charts for analytics dashboards
- Use Atlas Data Lake for archiving old data
- Monitor connection pool size and adjust as needed

---

**Need Help?**
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [Community Forums](https://www.mongodb.com/community/forums/)
