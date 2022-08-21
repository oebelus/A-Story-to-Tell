const express = require('express')
const router = express.Router()

//Import the Story
const Story = require('../models/Story')

//Check authorized users
const { checkAuth, checkNoAuth } = require('../config/checkauth')

//Login, landing page
router.get('/',checkNoAuth, (req, res) => {
    res.render('layout/login')
})

//Dashboard
router.get('/dashboard',checkAuth, async (req, res) => {
    try {
        const stories =  await Story.find({ user: req.user.id }).lean() //Check this
        res.render('dashboard', { 
            name: req.user.firstName,
            stories 
        })
    }
    catch(err) {
        console.log(err)
        res.render('error/404')
    }
})

//Main page
/*router.get('/main', checkAuth, (req, res) => {
    res.render('layout/main')
})*/

router.get('/logout', (req, res) => {
    req.logOut(function(err) {
        if (err) { return next(err) } res.redirect('/')
    })
})

module.exports = router