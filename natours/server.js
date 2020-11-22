const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

const app = require('./app')
dotenv.config({ path: './config.env' })

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

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
})

const Tour = mongoose.model('Tour', tourSchema)

const testTour = new Tour({
    name: 'The Forest Hiker2',
    rating: 4.7,
    price: 497
})

testTour.save().then(doc => {
    console.log(doc)
}).catch(error=> {
    console.error(error)
})


// START SERVER
const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})
