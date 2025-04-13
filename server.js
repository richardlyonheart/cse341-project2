require('dotenv').config();
const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT || 5500;

const app = express();

// Express middleware setup
app.use(bodyParser.json())
   .use(session({
       secret: process.env.SESSION_SECRET || "secret",
       resave: false,
       saveUninitialized: true,
       store: MongoStore.create({
           mongoUrl: process.env.MONGODB_URL,
           collectionName: 'sessions'
       }),
       cookie: {
           secure: process.env.NODE_ENV === 'production', // Use true in production with HTTPS
           httpOnly: true, // Enhances security
           maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
       }
   }))
   .use(passport.initialize())
   .use(passport.session())
   .use(cors({ origin: '*' }));

// Passport GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken; // Add the access token to the profile object
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    const loginMessage = req.session.user
        ? `You are now logged in as ${req.session.user.displayName}`
        : "You are not logged in";

    res.send(`
        <div>
            ${loginMessage}
        </div>
    `);
});

app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
    (req, res) => {
        req.session.user = {
            id: req.user.id,
            displayName: req.user.displayName || req.user.username || req.user.name,
            accessToken: req.user.accessToken // Store the access token in the session
        };
        res.redirect('/');
    }
);

app.get('/github/user-info', async (req, res) => {
    const accessToken = req.session.user?.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "No access token available" });
    }

    try {
        const response = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}` // Pass the access token in the header
            }
        });
        res.json(response.data); // Respond with data received from GitHub API
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: "Failed to fetch user info" });
    }
});

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