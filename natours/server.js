const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

const app = require('./app')
dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE,  {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log( `DB connection successful. \n${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

connectDB()


// START SERVER
const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})
