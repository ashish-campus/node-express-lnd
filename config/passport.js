import config from "../config/database.js";
import passportLocal from "passport-local";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const LocalStrategy = passportLocal.Strategy;


const passportFn = (passport) => {

    passport.use(new LocalStrategy((username, password, done) => {
        let query = {username: username};
        User.findOne(query).then(user =>{
            if(!user){
                return done(null, false, { message: 'No User Found!!'});
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong Password!!'});
                }
            }).catch(err => done(err));
        }).catch(err => done(err));
    }));

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    passport.serializeUser((user, done) => { done(null, user.id); });

};

export default passportFn;