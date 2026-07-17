import express from 'express';
import User from '../models/user.js';
import expressValidator from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';

const router = express.Router();

const registerRules = [
 expressValidator.check('name').isLength({min:1}).trim().withMessage('Name is required'),
  expressValidator.check('username').isLength({min:1}).trim().withMessage('Username is required'),
  expressValidator.check('email').isLength({min:1}).trim().withMessage('Email is required'),
  expressValidator.check('password').isLength({min:8}).trim().withMessage('password should be of min 8 characters'),
  expressValidator.check('password2').trim().custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];

const loginRules = [
  expressValidator.check('username').isLength({min:1}).trim().withMessage('Username is required'),
  expressValidator.check('password').isLength({min:1}).trim().withMessage('password is required'),
];

router.get('/register', (req, res) => {
    const registerUser = {
        name: '',
        username: '',
        email: '',
        password: '',
        password2: ''
    };
    res.render('register', {registerUser});
});

router.post('/register', registerRules, (req, res) => {
    console.log(req.body);
     const user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    };
     const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
       console.log(errors);
        res.render('register',
        { 
        user,
        errors: errors.mapped()
        });
    } else {
        const newUser = new User({
            name: user.name,
            email: user.email,
            username: user.username,
            password: user.password
        });
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(newUser.password, salt).then(hash => {
                newUser.password = hash;
                newUser.save().then(() => {
                    req.flash('success', 'You are now registered');
                }).catch( err => {
                    console.log(err);
                    req.flash('danger', 'Some Error in saving user !!');
                    res.redirect('/');
                });
                res.redirect('/users/login');
            }).catch(err => {
                console.log(err);
                req.flash('danger', 'Error in hashing !!');
                res.redirect('/');
            });
        }).catch(err => {
            console.log(err);
            req.flash('danger', 'Error in getting Salt !!');
            res.redirect('/');
        });
        
    }
});

router.get('/login', (req,res) => {
    const loginUser = {username: ''};
    res.render('login', {loginUser});
});

router.post('/login', loginRules, (req, res, next) => {
    const loginUser = {username: req.body.username, password: req.body.password};
    const errors = expressValidator.validationResult(req);
      if (!errors.isEmpty()) {
       console.log(errors);
        res.render('login',
        {
        loginUser,
        errors: errors.mapped()
        });
    } else {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req,res,next);
    }

});

router.get('/logout', (req, res, next) => {
    req.flash('success', 'Logged out Successfully');
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                console.error('Session destroy error:', destroyErr);
            }
            res.redirect('/users/login');
        });
    });
});

export default router;

