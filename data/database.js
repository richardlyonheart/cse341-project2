const { MongoClient } = require('mongodb');
let database; // Holds the connected database instance

const initDb = (callback) => {
    // If the database is already initialized, return it
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }

    // Connect to MongoDB
    MongoClient.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true, // Ensures proper connection parsing
        useUnifiedTopology: true // Avoids deprecated connection warnings
    })
    .then((client) => {
        database = client.db(); // Initialize the database (default name is set in connection string)
        console.log('Database initialized successfully');
        callback(null, database);
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        callback(err);
    });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};