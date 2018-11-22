const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const expressValidator = require("express-validator");

// settings
const app = express();
const port = process.env.PORT || 5000;

//DB connection
mongoose
    .connect(
        keys.MongodbURL,
        {
            useNewUrlParser: true,
            poolSize: 5,
            reconnectInterval: 500,
            reconnectTries: Number.MAX_VALUE,
            socketTimeoutMS: 2000,
            family: 4

        }
    )
    .then(
        () => {
            console.log("successfull DB connection");
        },
        err => {
            console.log("failed DB connection ");
        }
    );
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(expressValidator());

// api-routes
require("./app/api-routes")(app);

// Serve static server files
app.use('/uploads', express.static('./uploads'));


// Producction settings
if (1) {
    // Serve static files
    app.use(express.static(path.join(__dirname, "../client/build")));

    // Handle React routing, return all requests to React app
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
