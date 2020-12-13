const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')

process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    console.log('UNCAUGHT EXCEPTION! Shutting down...')
    process.exit(1)
})

dotenv.config()
const app = require('./app')


mongoose.connect(process.env.DATABASE,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=> console.log( `DB connection successful.`.cyan.underline))

// START SERVER
const port = process.env.PORT || 3000
const server = app.listen(port, ()=> {
    console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION! Shutting down...')
    server.close(()=> {
        process.exit(1)
    })
})
