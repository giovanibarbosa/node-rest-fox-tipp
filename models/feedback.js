const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    feedback: {
        type: String,
        require: true
    },
    confirmation: {
        type: String,
        require: true
    },
    vehicleId: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        require: true
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
