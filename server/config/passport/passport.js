const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const dotenv = require('dotenv').config();
const { User } = require('../../models/User');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:5000/auth/google/callback'
            }, function (accessToken, refreshToken, profile, done) {
                // User.findOne({ email: profile.email }, (err, user) => {
                //     done(null, user);
                // });
                done(null, profile);
            }
        )
    );
};