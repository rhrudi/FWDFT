const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Serialize/Deserialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }

                // 2. Check if user exists by email (link account)
                const email = profile.emails[0].value;
                user = await User.findOne({ email });
                if (user) {
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // 3. Create new user
                user = new User({
                    name: profile.displayName,
                    email: email,
                    googleId: profile.id
                });
                await user.save();
                done(null, user);

            } catch (err) {
                done(err, null);
            }
        }
    ));
} else {
    console.warn("WARNING: Google Client ID/Secret not found. Google Auth will not work.");
}

module.exports = passport;
