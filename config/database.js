const mongoose = require('mongoose')

module.exports = connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}