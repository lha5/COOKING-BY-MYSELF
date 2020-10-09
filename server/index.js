const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

let app = express();

const config = require('./config/key');

mongoose
    .connect(
        config.mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
    .then(() => console.log('MongoDB is connected!'))
    .catch(err => console.log(err));

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
if (process.env.NODE_ENV === "production") {

    // Set static folder
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("client/build"));

    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}

const port = 5000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});