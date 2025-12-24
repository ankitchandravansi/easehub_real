import mongoose from 'mongoose';

const uri = "mongodb+srv://easehub:HuxhX0HaI535XyqF@cluster0.f6xugmd.mongodb.net/?appName=Cluster0";

console.log('Testing connection to:', uri);

mongoose.connect(uri)
    .then(conn => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
