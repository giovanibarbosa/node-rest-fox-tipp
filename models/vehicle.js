const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    plate_number: {
        type: String,
        require: true
    },
    plate_city: {
        type: String,
        require: true
    },
    plate_uf: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    date_added: {
        type: Date,
        require: true
    },
    thumb: {
        type: String,
    },
    alert_mode: {
        type: Boolean
    },
    feedback_list: [
        {
            feedbackId: {type: Schema.Types.ObjectId, ref: 'Feedback'}
        }
    ]
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
