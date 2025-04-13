require('dotenv').config();
const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware for sessions
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false, // Only save sessions when there’s data
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL, // MongoDB connection string
        collectionName: 'sessions', // Name of the collection to store sessions
        ttl: 14 * 24 * 60 * 60 // Session expiration in seconds (14 days)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true, // Prevent client-side access
        maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    }
}));
// CORS configuration
app.use(cors({
    origin: '*', // Adjust as needed for specific domains
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies to be sent
}));

// Middleware for parsing and initializing Passport
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    console.log('GitHub Profile:', profile); // Debugging
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Home route
app.get('/', (req, res) => {
    let loginMessage = req.session.user
        ? `You are now logged in as ${req.session.user.displayName}`
        : "You are not logged in";
    res.send(`
        <div>
            ${loginMessage}
        </div>
    `);
});

// GitHub OAuth callback
app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
    (req, res) => {
        if (!req.user) {
            console.error('GitHub User is undefined!');
            return res.status(500).json({ message: "Authentication failed, no user object" });
        }

        // Set user information in session
        req.session.user = {
            id: req.user.id,
            displayName: req.user.displayName || req.user.username || req.user.name
        };

        // Explicitly save the session
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return res.status(500).json({ message: "Failed to save session" });
            }
            console.log('Session after saving in /github/callback:', req.session);
            res.redirect('/');
        });
    }
);
// Debug route to test sessions
app.get('/test-session', (req, res) => {
    console.log('Session:', req.session);
    res.json(req.session);
});

// Routes
app.use('/', require('./routes/index'));

// MongoDB initialization and server start
mongodb.initDb((err) => {
    if (err) {
        console.error("❌ Failed to connect to database:", err);
    } else {
        console.log("✅ Database initialized successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on Port ${PORT}`);
        });
    }
});