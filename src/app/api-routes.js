const Book = require("../app/models/book");
const Session = require('../app/models/session');
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");

const {
    manageLogin,
    manageSignup,
    loginDataValidator,
    isLogin,
    isAdmin,
    dataAddBookValidator,
    manageAddBook,
    manageUpdateBook,
    manageDeleteBook,
} = require('./middleware')

//ROUTES
module.exports = app => {
    //SIGN UP
    app.post(
        "/api/signup",
        loginDataValidator,
        manageSignup,
        (req, res) => {
            res.status(200).json({
                status: "Successfully signup", user: req.body.email
            });
            return;
        }
    );

    //LOG IN - gen JWT
    app.post("/api/login", loginDataValidator, manageLogin, (req, res) => {
        const user = {
            email: req.body.email,
            admin: res.locals.admin
        };
        const token = jwt.sign({ user }, keys.jwtSecret);

        //save the token into sessionDB
        var newSession = new Session();
        Session.findOneAndUpdate({ 'email': req.body.email }, { email: req.body.email, token: token }, { upsert: true }, (err) => {
            if (err) {
                res.status(503).send(err);
                res.end();
                return;
            } else {
                res.status(200).json({
                    status: "Successfully login", token
                });

            }
        });
    });

    //GET BOOKS
    app.get("/api/books", isLogin, (req, res) => {
        Book.find({}, (err, data) => {
            if (err) {
                res.status(503).send({ error: "Can't access to DB" });
                res.end();
            } else {
                res.status(200).json({
                    data
                });
            }
        })

    });

    //ADD BOOKS
    app.post("/api/books", isLogin, dataAddBookValidator, isAdmin, manageAddBook, (req, res) => {
        res.status(200).send({ data: res.locals.data }).end();
    });

    //UPDATE BOOKS - si se actualiza la imagen se debe borrar la anterior
    app.put("/api/books", isLogin, isAdmin, dataAddBookValidator, manageUpdateBook, (req, res) => {
        res.status(200).json({
            status: "Successfully put"
        });
    });

    //DELETE BOOKS - tambien se debe borrar la imagen
    app.delete("/api/books", isLogin, isAdmin, manageDeleteBook, (req, res) => {
        res.status(200).json({
            status: "Successfully deleted"
        });
    });

};
