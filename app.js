const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const fileUpload = require('express-fileupload')


// import routers
const orderRouter = require('./routes/api/v1/order')
const userRouter = require('./routes/api/v1/user')
const productRouter = require('./routes/api/v1/product')

const url = 'mongodb+srv://NormalAccess:H3lioTr%40ining@cluster0-1xd3l.mongodb.net/test?retryWrites=true&w=majority'
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


let app = client.connect()
  .then(connection => {

    

    const app = express();
    app.locals.jwtSecret = "EpStEiNdIdNtKiLlHiMsElF"

    app.locals.collectProduct = connection.db('Hauntco').collection('products')
    app.locals.collectUser = connection.db('Hauntco').collection('users')
    app.locals.collectOrder = connection.db('Hauntco').collection('orders')

    console.log("Connected to DB")

    //'mongodb+srv://NormalAccess:H3lioTr%40ining@cluster0-1xd3l.mongodb.net/test?retryWrites=true&w=majority'
    // H3lioTr%40ining


    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    //primary middleware
    app.use(cors())

    // built in middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'react')));

    // third party middleware
    app.use(logger('dev'));
    app.use(cookieParser());
    

    // bind routes
    app.use(fileUpload())
    app.use('/api/v1/product',productRouter)
    app.use('/api/v1/order',orderRouter)
    app.use('/api/v1/user',userRouter)
    


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
    process.on('SIGINT', () => {
     
        client.close()
        console.log(' DB Closed');
        process.exit()
      })
    return app
    
  })
  .catch(error => {
    console.log("Express Error app.js", error)
  })

module.exports = app;
