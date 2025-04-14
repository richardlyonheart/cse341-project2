require('dotenv').config();
const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const GitHubStrategy = require('passport-github').Strategy;

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Initialize database and configure sessions
mongodb.initDb((err) => {
    if (err) return console.error('❌ Failed to connect to database:', err);

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            dbName: 'project2',
            collectionName: 'sessions'
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 14 * 24 * 60 * 60 * 1000
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
});

// OAuth Logic
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

app.get('/', (req, res) => {
    const message = req.session.user
        ? `Logged in as ${req.session.user.displayName}`
        : 'Not logged in';
    res.send(message);
});

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/?message=Login+Failed' }),
  (req, res) => {
      if (!req.user) {
          return res.redirect('/?message=Login+Failed');
      }
      req.session.user = {
          id: req.user.id,
          displayName: req.user.displayName || req.user.username || req.user.name
      };
      res.redirect('/');
      console.log('Authenticated User:', req.user);
  }
);

    // Start the server only after DB is initialized
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on Port ${PORT}`);
    });