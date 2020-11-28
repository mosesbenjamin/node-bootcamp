const Tour = require('../models/tourModel')

const aliasTopTours = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

const getAllTours = async (req, res)=> {
    try {
        console.log(req.query)
        // BUILD QUERY
        // 1A)Filtering
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        // 1B)Advanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
            // sort('price -ratingsAverage')
        }else {
            query.sort('-createdAt')
        }

        // 3) Field Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit
        // page=2&limit=10, 1-10, page 1; 11-20, page 2, 21-30, page 3
        query = query.skip(skip).limit(limit)

        if(req.query.page){
            const numTours = await Tour.countDocuments()
            if(skip >= numTours) throw new Error('This page does not exist')
        }

        // EXECUTE QUERY
        const tours = await query
        // query.sort().select().skip().limit()

        // const query = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {tours}
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
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
               message: error
           })
       }
}

const updateTour = async (req, res)=> {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {tour}
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
   }
}

const deleteTour = async (req, res)=> {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

const getTour = async (req, res)=> {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {tour}
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

module.exports = { 
    getAllTours, 
    getTour, 
    updateTour, 
    deleteTour, 
    createTour,
    aliasTopTours 
}