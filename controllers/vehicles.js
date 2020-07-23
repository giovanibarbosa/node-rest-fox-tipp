const {validationResult} = require('express-validator');

const Vehicle = require('../models/vehicle');
const Feedback = require('../models/feedback');

const getVehiclesByQuery = (queryObject, currentPage, perPage, res, next) => {
    let totalItems;

    Vehicle.countDocuments(queryObject)
        .then(count => {
            totalItems = count;
            return Vehicle.find(queryObject)
                .skip(currentPage * perPage)
                .limit(perPage);
        })
        .then(vehicles => {
            const responseJson = {
                message: 'Fetched vehicles.',
                vehicles: vehicles,
                totalItems: totalItems
            };
            res.status(200).json(responseJson);
            console.log(responseJson);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.addVehicle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const plate_number = req.body.plate_number;
    const plate_city = req.body.plate_city;
    const plate_uf = req.body.plate_uf;
    const color = req.body.color;
    const thumb = req.body.thumb;
    const alert_mode = req.body.alert_mode;

    const vehicle = new Vehicle({
        name: name,
        plate_number: plate_number,
        plate_city: plate_city,
        plate_uf: plate_uf,
        color: color,
        thumb: thumb,
        alert_mode: alert_mode,
        date_added: new Date()
    });

    vehicle.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Vehicle created successfully!',
                vehicle: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteVehicle = (req, res, next) => {
};

exports.getVehicleById = (req, res, next) => {
    const id = req.params.id;
    Vehicle.findById(id)
        .then(vehicle => {
            if (!vehicle) {
                const error = new Error('Could not find vehicle.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Vehicle fetched.', vehicle: vehicle});
            console.log({message: 'Vehicle fetched.', vehicle: vehicle});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getRecent = (req, res, next) => {
    const perPage = parseInt(req.get('Per-Page')) || 10;
    const currentPage = parseInt(req.get("Current-Page")) || 0;
    let totalItems;

    Vehicle.countDocuments()
        .then(count => {
            totalItems = count;
            return Vehicle.find()
                .sort({date_added: 'desc'})
                .skip(currentPage * perPage)
                .limit(perPage);
        })
        .then(vehicles => {
            const responseJson = {
                message: 'Fetched vehicles.',
                vehicles: vehicles,
                totalItems: totalItems
            };
            res.status(200).json(responseJson);
            console.log(responseJson);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.search = (req, res, next) => {
    const perPage = parseInt(req.query.per_page) || 10;
    const currentPage = parseInt(req.query.current_page) || 0;
    const uf = req.query.uf === 'all' ? null : req.query.uf;
    const color = req.query.color === 'all' ? null : req.query.color;
    const term = req.query.term;

    const or_conditions = [{'name': {$regex: term, $options: 'i'}}, {'plate_number': {$regex: term, $options: 'i'}},
        {'plate_city': {$regex: term, $options: 'i'}}, {'plate_uf': {$regex: term, $options: 'i'}},
        {'color': {$regex: term, $options: 'i'}}];

    const and_conditions = [
        {'plate_uf': {$regex: uf, $options: 'i'}},
        {'color': {$regex: color, $options: 'i'}}];

    const queryObject = {
        $and: and_conditions,
        $or: or_conditions
    };

    getVehiclesByQuery(queryObject, currentPage, perPage, res, next);
};

exports.getAll = (req, res, next) => {
    const perPage = parseInt(req.query.per_page) || 10;
    const currentPage = parseInt(req.query.current_page) || 0;
    const uf = req.query.uf;
    const alertMode = req.query.alert_mode === 'true';

    const queryObject = {alert_mode: alertMode, plate_uf: uf};

    getVehiclesByQuery(queryObject, currentPage, perPage, res, next);
};

exports.provideFeedback = (req, res, next) => {
    const id = req.params.id;
    const feedback = req.body.feedback;
    const confirmation = req.body.confirmation;

    Vehicle.findById(id)
        .then(vehicle => {
            if (!vehicle) {
                const error = new Error('Could not find vehicle.');
                error.statusCode = 404;
                throw error;
            }
            const feedbackObj = new Feedback({
                feedback: feedback,
                confirmation: confirmation,
                vehicleId: id
            });

            feedbackObj.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Feedback just posted.',
                feedback: result
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
