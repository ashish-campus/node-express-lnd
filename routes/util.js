
//access Control
export const ensureAuthentication = (req, res, next) => {

    if(req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
};  