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
                callbackURL: 'http://localhost:5000/api/user/google/callback'
            }, function (accessToken, refreshToken, profile, done) {
                User.findOrCreate({ email: profile.email }, function (err, user) {
                    if (err) {return done(err);}
                    return done(null, user);
                });
            }
        )
    );
};