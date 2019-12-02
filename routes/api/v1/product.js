const express = require('express');
const router = express.Router();
const fs = require('fs')
var ObjectId = require('mongodb').ObjectId
const jwt = require('jsonwebtoken')

const verifyToken = require('../verifyFunction')



//get all Items from database
router.get('/', function (req, res, next) {

    try {
        req.app.locals.collectProduct.find({}).toArray(function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result)
        })
    }
    catch (error) {
        console.log('Error', error)
    }
})



//delete an item from the database
router.delete('/:id', function (req, res, next) {

    
    try {
        req.app.locals.collectProduct.deleteOne({ _id:ObjectId(req.params.id) }, req.body)
        res.send("OK")


    } catch (error) {
        console.log('Error', error)
    }


})


module.exports = router;