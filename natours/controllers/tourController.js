const Tour = require('../models/tourModel')

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

const createTour = async (req, res)=> {
       try {
            const tour = await Tour.create(req.body)
            res.status(201).json({
                status: 'success',
                data: {tour}
            })
       } catch (error) {
           res.status(400).json({
               status: 'fail',
               message: 'Invalid data sent!'
           })
       }
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
    createTour 
}