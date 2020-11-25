const Tour = require('../models/tourModel')

const checkBody = ((req, res, next) => {
    const { name, price } = req.body

    if(!name || !price){
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next()
})

const getAllTours = (req, res)=> {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        // }
    })
}

const createTour = (req, res)=> {

        res.status(201).json({
            status: 'success',
            // data: {
            //     tour: newTour
            // }
        })
}

const updateTour =(req, res)=> {
    res.status(200).json({
        status: 'success',
        // data: {
        //     tour: '<Updated tour here..>'
        // }
    })
}

const deleteTour = (req, res)=> {
    res.status(204).json({
        status: 'success',
        data: null
    })
}

const getTour = (req, res)=> {

    res.status(200).json({
        status: 'success',
        // data: {
        //     tour
        // }
    })
}

module.exports = { 
    getAllTours, 
    getTour, 
    updateTour, 
    deleteTour, 
    createTour ,
    checkBody
}