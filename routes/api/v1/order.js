const express = require('express');
const router = express.Router();
const fs = require('fs')
var ObjectId = require('mongodb').ObjectId

const verifyToken = require('../verifyFunction')



//add a new order 
router.post('/', verifyToken, function (req, res, next) {
    console.log("POST")

    try {
        console.log(req.body)
        req.app.locals.collectOrder.insertOne(req.body)
        res.json(req.freshToken)
    }
    catch (error) {
        console.log('Error', error)
        res.status(400).send(error)
    }

})



//get all Order Items from database
router.get('/:id', function (req, res, next) {

    try {
        req.app.locals.collectOrder.findOne({ userId: parseInt(req.params.id) })
            .then(result => {
                if (result !== null) {


                    res.json(result)
                }
            })

    }
    catch (error) {
        console.log('Error', error)
    }
})



//delete a specific Item from Order
router.put('/:id', function (req, res, next) {

    try {
        req.app.locals.collectOrder.replaceOne({ _id:ObjectId(req.params.id) }, req.body) 
            res.send("OK")
    }
    catch {
        res.send("NOT OK")
    }
    
})




module.exports = router;