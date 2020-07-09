const express = require('express');
const bodyParser = require('body-parser');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

campsiteRouter.route('/')
    .get((req, res, next) => {
        Campsite.find()
            .then(campsites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json') //as opposed to 'Content-Type', 'text/plain' that we had when simply console.log()-ing
                res.json(campsites); //nolonger need the res.end method because this automatically closes the stream after sending the response to the client
            })
            .catch(err => next(err)) //passes the error onto the overall error handler, letting Express worry about handling the error because it has that already built in
    })
    .post((req, res, next) => {
        Campsite.create(req.body) //Mongoose will let us know if something is wrong based on the schema we've given our model for Campsite.
            .then(campsite => {
                console.log('Campsite Created ', campsite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })
    .delete((req, res, next) => {
        Campsite.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    }); //finally, a really clear example of why semicolons are super important! 

campsiteRouter.route('/:campsiteId')
    .get((req, res) => {
        Campsite.findById(req.params.campsiteId)
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
    })
    .put((req, res, next) => {
        Campsite.findByIdAndUpdate(req.params.campsiteId, {
            $set: req.body
        }, { new: true })
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    })
    .delete((req, res) => {
        res.end(`Deleting campsite: ${req.params.campsiteId}`);
    });

module.exports = campsiteRouter;