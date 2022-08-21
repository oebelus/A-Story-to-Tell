const express = require('express')
const router = express.Router()
const passport = require('passport')
//const { checkAuth, checkNoAuth } = require('../config/checkauth')

//Auth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//Dashboard
router.get('/google/callback', passport.authenticate('google', {'failureRedirect': '/', 'successRedirect': '/dashboard'}))

module.exports = router