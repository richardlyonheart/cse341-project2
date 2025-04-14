require('dotenv').config();
const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const GitHubStrategy = require('passport-github').Strategy;

const PORT = process.env.PORT || 5500;
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Replace with your frontend's URL in production
    credentials: true
}));

// Initialize Database and Start Server
mongodb.initDb((err, db) => {
    if (err) {
        console.error('❌ Failed to connect to database:', err);
        return;
    }

    console.log('✅ Database initialized successfully');

    // Set up sessions with MongoDB as the session store
    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false, // Prevent storing empty sessions
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: 'sessions',
            mongoOptions: { useUnifiedTopology: true }
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id); // Serialize user ID to minimize session size
    });

    passport.deserializeUser((id, done) => {
        // Replace with user lookup logic if needed
        done(null, { id });
    });

    // Routes
    app.use('/', require('./routes/index'));

    app.get('/', (req, res) => {
        const loginMessage = req.session.user
            ? `You are logged in as ${req.session.user.displayName}`
            : 'Please log in';
        res.send(`<div>${loginMessage}</div>`);
    });

    app.get('/github/callback',
        passport.authenticate('github', { failureRedirect: '/?message=Login+Failed' }),
        (req, res) => {
            req.session.user = {
                id: req.user.id,
                displayName: req.user.displayName || req.user.username || req.user.name
            };
            res.redirect('/');
        }
    );

    // Start the server only after DB is initialized
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on Port ${PORT}`);
    });
});