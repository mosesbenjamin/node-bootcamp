const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const fs = require('fs')
const Tour = require('../../models/tourModel')

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

// READ JSON FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))


// IMPORT DATA INTO DATABASE

const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

// DELETE ALL DATA FROM DATABASE

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if(process.argv[2] === '--import'){
    importData()
} else if (process.argv[2] === '--delete'){
    deleteData()
}



