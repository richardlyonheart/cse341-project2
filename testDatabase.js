const { initDb, getDatabase } = require('./data/database');

initDb((err, db) => {
    if (err) {
        console.error('Error initializing the database:', err);
    } else {
        console.log('Database successfully initialized!');
        console.log('Database object:', db);
    }
});