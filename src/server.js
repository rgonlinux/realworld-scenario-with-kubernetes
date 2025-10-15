import { MongoClient } from 'mongodb';
import app from './app.js';

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DATABASE;

if (!username || !password || !host || !dbName) {
  console.error('Error: One or more MongoDB environment variables are not set.');
  process.exit(1);
}
const uri = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:27017/${dbName}?authSource=admin`;

const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const db = client.db(dbName);
    app.locals.db = db; 

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

// 5. Run the function
startServer();