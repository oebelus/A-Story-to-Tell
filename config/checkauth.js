const passport = require('passport')

module.exports = {
    checkAuth: function checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        else {
            res.redirect('/') 
        }
    },
    
    checkNoAuth: function checkNoAuth(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        }
        else {
            return next()
        }
    }
}