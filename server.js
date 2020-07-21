require('dotenv').config();
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const mongoConnectionString = process.env.MONGO_DB_URL;

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        server.listen(port);
    })
    .catch(err => console.log(err));
