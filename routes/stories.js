const express = require('express')
const router = express.Router()
const { checkAuth, checkNoAuth } = require('../config/checkauth')

//Import the Story
const Story = require('../models/Story')

//Show add page
router.get('/add', (req, res) => {
    res.render('stories/add')
})

//Add Story
router.post('/', checkAuth, async (req, res) => {
    try {
        req.body.user = req.user.id,
        res.locals.user = req.user._id,
        await Story.create(req.body)
        res.redirect('/dashboard')
    }
    catch(err) {
        console.log(err)
        res.render('../views/error/505.ejs')
    }
})

//Show all stories
router.get('/', checkAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()
        
        res.render('stories/stories.ejs', {stories})
    }
    catch(err) {
        console.log(err)
        res.render('error/500.ejs')
    }
})

router.get('/:id', checkAuth,  async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()

        if (!story) {
            return res.render('error/404.ejs')
        } 
        
        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
        }
            else { 
            res.render('stories/show.ejs', {story}) 
        }
    } 
    catch(err) {
        console.log(err)
        res.render('error/500.ejs')
    }
})

//Edit page
router.get('/:id', checkAuth,  async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {story})
        }
    } catch(err) {
        console.log(err)
        res.render('/views/error/500.ejs')
    }
})

/*router.use(function(req, res, next) {
    res.locals.user = req.user || null //If the user doesn't exist = null
    next()
})*/

//PUT the edited thing
router.put('/:id', checkAuth,  async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
    
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true, 
                runValidators: true // Make sure that the fields are valid
            })
            res.redirect('/dashboard')
        }
    } catch(err) {
        console.error(err)
        return res.render('error/500')
    }
    
})

router.delete('/:id', checkAuth,  async (req, res) => {

    try {
        let story = await Story.findById(req.params.id).lean()
    
        if (!story) {
            res.render('error/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.remove({_id: req.params.id})
            res.redirect('/dashboard')
            }

    } catch(err) {
        console.error(err)
        return res.render('error/500')
        }
    
    })

router.get('/user/:userId', checkAuth,  async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()

        res.render('stories/stories', {stories})
    }
    catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router