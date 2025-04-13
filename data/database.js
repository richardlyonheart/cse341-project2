const { MongoClient } = require('mongodb');
let database; // Holds the connected database instance

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized');
        return callback(null, database);
    }

    MongoClient.connect(process.env.MONGODB_URL) // Removed deprecated options
        .then((client) => {
            database = client.db(); // Initialize the database
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