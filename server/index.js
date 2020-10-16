const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoDBConfig = require('./config/key');
const path = require('path');
const dotenv = require('dotenv').config();
const morgan = require('morgan');

const app = express();

// MongoDB
mongoose
    .connect(
        mongoDBConfig.mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
    .then(() => console.log('MongoDB is connected!'))
    .catch(err => console.log(err));

app.use(cors());
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// using API
app.use('/api/user', require('./routes/user'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {

    // Set static folder
    // All the javascript and css files will be read and served from this folder
    app.use(express.static('client/build'));

    // index.html for all page routes    html or routing and navigation
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

const port = 5000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});