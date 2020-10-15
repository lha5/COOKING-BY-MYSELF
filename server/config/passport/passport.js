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
                callbackURL: 'http://localhost:5000/api/user/google/callback',
                // passReqToCallback: true,
                // proxy: true
            }, function (accessToken, refreshToken, profile, done) {
                const userInfo = {
                    'email': profile._json.email,
                    'name' : profile._json.name
                };

                User.findOne({ 'email': userInfo.email }, (err, user) => {
                    if (err) {return done.json({ success: false, err })}

                    if (user) {
                        done(null, user);
                    } else {
                        new User(userInfo)
                            .save()
                            .then((newUser) => {
                                done(null, newUser);
                            });
                    }
                });
            }
        )
    );
};