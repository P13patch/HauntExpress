const express = require('express');
const router = express.Router();
//var ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');


const googleAuth = new OAuth2Client('159189926960-ruhearc07f379bebmofjnhn0tg9rnt8c.apps.googleusercontent.com')

// add new user
router.post('/', function (req, res, next) {


    req.app.locals.collectUser.findOne({ email: req.body.email })
        .then(foundDoc => {
            console.log(foundDoc)
            if (foundDoc !== null) {

                throw new Error("User Already Exists")
            }
            else {
                bcrypt.hash(req.body.password, 13)
                    .then(passwordHash => {
                        //set new property in body, passwordHash and
                        //delete property password
                        req.body.passwordHash = passwordHash
                        delete req.body.password
                        req.app.locals.collectUser.insertOne(req.body)
                            .then(result => {
                                res.send("OK")
                            })
                            .catch(error => {
                                res.status(400).json({ msg: "User Not Added", })
                            })
                    })
            }
        })
        .catch(error => {
            res.status(400).json({ msg: "User Not Added" })
            console.log('Error', error)
        })
})


router.post('/login', function (req, res, next) {

    //locate user from stored database of users
    req.app.locals.collectUser.findOne({ email: req.body.email })
        .then(foundDoc => {
            if (foundDoc === null) {
                throw new Error("NOT AUTHORIZED")
            }

            // input password is hashed and compared to stored hash-password
            return bcrypt.compare(req.body.password, foundDoc.passwordHash)
        })
        .then(validPassword => {
            if (validPassword !== true) {
                throw new Error("INVALID PASSWORD")
            }

            return new Promise((resolve, reject) => {

                jwt.sign({ email: req.body.email }, req.app.locals.jwtSecret, { expiresIn: '1h' }, (error, token) => {
                    if (error !== null) {
                        reject(error)
                    }
                    else {
                        resolve(token)
                    }
                })
            })
        })
        .then(token => {
            
            res.json(token)
        })
        .catch(error => {
            res.status(403).statusMessage(error.msg)
        })


})


router.post('/oauth/google', function (req, res, next) {
    
    //verify google token
    googleAuth.verifyIdTokenAsync({
        idToken: req.body.tokenId,
        audience: '159189926960-ruhearc07f379bebmofjnhn0tg9rnt8c.apps.googleusercontent.com'
    })
    
        .then(ticket => {
            
            return ticket.getPayload()
        })
        .then(payload => {
            return req.app.locals.collectUser.findOne({ email: payload.email })
        })
        .then(foundDoc => {
            
            if (foundDoc === null) {
                throw new Error("NOT AUTHORIZED")
            }

            return new Promise((resolve, reject) => {

                jwt.sign({ email: foundDoc.email }, req.app.locals.jwtSecret, { expiresIn: '1h' }, (error, token) => {
                    if (error !== null) {
                        reject(error)
                    }
                    else {
                        resolve(token)
                    }
                })
            })
        })
        .then(token => {
            console.log(token)
            res.json(token)
        })
        .catch(error => {
            console.log(error)
            res.status(403)//.statusMessage(error.msg)
        })
})



module.exports = router;