const express = require("express");
const mongodb = require('./data/database');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.error("Database initialization failed:", err);
    } else {
        app.listen(PORT, () => {
            console.log(`Database is listening, and node is running on port ${PORT}`);
        });
    }
});