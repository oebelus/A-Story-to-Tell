//Calling libraries
const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const logger = require('morgan')
const session = require('express-session')
const methodOverride = require('method-override')

//The app
const app = express()

//environment configuration
dotenv.config({ path: './config/config.env' })

//Passport configuration
require('./config/passport')(passport)

//Connecting Database
const connectDB = require('./config/database')
const MongoStore = require('connect-mongo')
connectDB()

//Logs file
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'))
}

//View Engine
app.set('view engine', 'ejs')
app.locals.moment = require('moment')

//Helper functions
app.locals.truncate = function(str, len) {
    if  (str.length > len) {
        return str.slice(0, len) + '...' 
    } return str
}

/*app.locals.editBtn = function(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
            return `<a href="/stories/edit/${storyId}" btn-floating btn-large waves-effect waves-light"><i class = "fas fa-edit></i></a>`
        } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
        }
    } else {
        return ''
    }
}*/                           // EDIT BUTTON: Find a solution later

//To make the story submit
app.use(express.urlencoded({extended: false})) //To accept form data
app.use(express.json())

//Method Override: PUT
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

//Sessions
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Display the static files li,ked to the main ejs (media, css, js...)
app.use(express.static('./public'));

//Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

//Listening
const PORT = process.env.PORT
app.listen(PORT, console.log(`Process running in ${process.env.NODE_ENV} on port: ${PORT}`))