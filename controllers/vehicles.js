const {validationResult} = require('express-validator');

const Vehicle = require('../models/vehicle');

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
};

exports.search = (req, res, next) => {
};

exports.getAll = (req, res, next) => {
    const perPage = parseInt(req.query.perPage) || 10;
    const currentPage = parseInt(req.query.currentPage) || 0;
    const uf = req.query.uf;
    const alertMode = req.query.alertMode === 'true';
    let totalItems;
    const queryObject = {alert_mode: alertMode, plate_uf: uf};

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

exports.provideFeedback = (req, res, next) => {

};
