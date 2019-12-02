const jwt = require('jsonwebtoken')



function verifyToken(req, res, next) {

    //get authorization header from api packet
    let auth = req.header('Authorization')

    //check to make sure I got the authorization header
    if (auth !== undefined) {

        //slpit the header into 'bearer' and the token
        let [, token] = auth.split(" ")


        //verify incoming token

        return new Promise((resolve, reject) => {
            jwt.verify(token, req.app.locals.jwtSecret, (error, payload) => {

                if (error !== null) {
                    
                    reject(error)
                    
                }
                else {
                    resolve(payload)
                }
            })
        })
            .then(payload => {

                //create new jwt
                return new Promise((resolve, reject) => {

                    jwt.sign({ email: payload.email }, req.app.locals.jwtSecret, { expiresIn: '1h' }, (error, token) => {

                        if (error !== null) {
                            reject(error)
                        }
                        else {
                            resolve(token)
                        }

                    })

                })
            })
            .then(freshToken => {

                //add fresh token to req
                req.freshToken = freshToken

                //call endpoint function
                next()
            })
            .catch(error => {
                console.log(error)
                res.sendStatus(403)
            })
    }
    else {
        res.sendStatus(403)
    }
}


module.exports = verifyToken