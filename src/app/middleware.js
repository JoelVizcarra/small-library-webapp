const User = require("../app/models/user");
const keys = require("../config/keys");
const Book = require("../app/models/book");
const Session = require("../app/models/session");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// IMAGE UPLOAD OPTIONS AND VALIDATION
// file type and data validation
const imageFilter = function (req, file, cb) {
    if (file.mimetype !== "image/jpeg") {
        cb(new Error("Only accept jpeg and jpg image format."), false);
        return;
    }
    //Validate data: if the data is invalid we don't wanna save the image
    req.check("title", "There must be a title").isLength({ min: 1, max: 50 });
    if (req.body.author == "") req.body.author = "Anonymous";
    req.check("author", "There must be an author").isLength({
        min: 1,
        max: 50
    });
    req.check("yearPub", "Invalid year of publication").isInt({
        min: 1,
        max: new Date().getFullYear()
    });
    req.check("edition", "Invalid edition").isInt({ min: 1, max: 200 });
    req.check("stock").isInt({ min: 0, max: 99999 });
    const validationErrors = req.validationErrors();
    if (validationErrors) {
        cb(new Error("Wrong book data"), false);
        return;
    }
    cb(null, true);
};

//img storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/img/books-img/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 3 },
    fileFilter: imageFilter
}).single("bookImage");

module.exports = {
    //MIDDLEWARE
    //managing signup(¿user already exist?)
    manageSignup: function (req, res, next) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                res.sendStatus(503);
                res.end();
                return;
            }
            if (user) {
                res.status(400).send({ error: "Email already taken" });
                res.end();
                return;
            } else {
                var newUser = new User();
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.admin = 0;
                newUser.save(function (err) {
                    if (err) {
                        res.sendStatus(503);
                        res.end();
                        return;
                    } else {
                        next();
                    }
                });
            }
        });
    },

    //managing login (registrered user and pass / saving admin bool)
    manageLogin: function (req, res, next) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                res.sendStatus(503);
                res.end();
                return;
            }
            if (!user) {
                res.status(403).send({ error: "Wrong username" });
                res.end();
                return;
            }
            if (!user.validatePassword(req.body.password)) {
                res.status(403).send({ error: "Wrong password" });
                res.end();
                return;
            }
            res.locals.admin = user.admin;
            next();
        });
    },

    //data validator
    loginDataValidator: function (req, res, next) {
        req.check("email", "Invalid email").isEmail();
        req.check("password", "Invalid password").isLength({ min: 5 });
        if (req.validationErrors()) {
            res.status(400).send({ error: "Invalid data" });
            res.end();
            return;
        } else {
            next();
        }
    },

    //Validate permission and admin permission
    isLogin: function (req, res, next) {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader === "undefined") {
            res.status(403).send({ error: "Wrong token" });
            res.end();
            return;
        } else {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            jwt.verify(bearerToken, keys.jwtSecret, (err, data) => {
                if (err) {
                    res.status(403).send({ error: "Wrong token" });
                    res.end();
                    return;
                } else {
                    // Check the session
                    Session.findOne(
                        { email: data.user.email },
                        (err, session) => {
                            if (err) {
                                res.status(503).send({
                                    error: "Error while validating the session"
                                });
                                res.end();
                                return;
                            } else {
                                if (session.token != bearerToken) {
                                    res.status(403).send({
                                        error: "Your session has expire"
                                    });
                                    res.end();
                                    return;
                                } else {
                                    // Save the admin bool in locals
                                    res.locals.admin = data.user.admin;
                                    next();
                                }
                            }
                        }
                    );
                }
            });
        }
    },

    dataAddBookValidator: function (req, res, next) {
        upload(req, res, function (err) {
            if (err) {
                res.status(400).send({ error: err.message });
                return;
            } else {
                next();
            }
        });
    },
    manageAddBook: function (req, res, next) {
        //VALIDATE BOOK DATA
        req.check("title", "There must be a title").isLength({ min: 1, max: 50 });
        if (req.body.author == "") req.body.author = "Anonymous";
        req.check("author", "There must be an author").isLength({
            min: 1,
            max: 50
        });
        req.check("yearPub", "Invalid year of publication").isInt({
            min: 1,
            max: new Date().getFullYear()
        });
        req.check("edition", "Invalid edition").isInt({ min: 1, max: 200 });
        req.check("stock").isInt({ min: 0, max: 99999 });
        const validationErrors = req.validationErrors();
        if (validationErrors) {
            res.status(400).send({ error: "Invalid book data." }).end;
            return;
        }
        //SAVE BOOK DB
        var newBook = new Book();
        newBook.title = req.body.title;
        newBook.author = req.body.author;
        newBook.yearPub = req.body.yearPub;
        newBook.edition = req.body.edition;
        newBook.stock = req.body.stock;
        req.file != null
            ? (newBook.bookImage = req.file.path)
            : (newBook.bookImage = "./uploads/img/books-img/no-book-img.jpg");

        newBook.save(function (err, data) {
            if (err) {
                res.status(503).send({ error: "Can't save into the DB" });
                console.log('ups');
                res.end();
                return;
            } else {
                res.locals.data = data;
                next();
            }
        });
    },
    manageUpdateBook: function (req, res, next) {
        if (req.body._id == null) {
            res.status(400).send({ error: "Invalid book ID" });
            res.end();
            return;
        }
        if (!req.body._id.match(/^[a-fA-F0-9]{24}$/)) {
            res.status(400).send({ error: "Invalid book ID" });
            res.end();
            return;
        }
        Book.findOne({ _id: req.body._id }, (err, data) => {
            if (err) {
                res.status(503).send({ error: "Error while accessing the DB" });
                res.end();
                return;
            } else {
                var oldBookImage = data.bookImage;
                var newBook = new Book();
                newBook.title = req.body.title;
                newBook.author = req.body.author;
                newBook.yearPub = req.body.yearPub;
                newBook.edition = req.body.edition;
                newBook.stock = req.body.stock;
                if (req.file != null) newBook.bookImage = req.file.path;
                else newBook.bookImage = oldBookImage;

                Book.updateOne(
                    { _id: req.body._id },
                    {
                        title: newBook.title,
                        author: newBook.author,
                        yearPub: newBook.yearPub,
                        edition: newBook.edition,
                        stock: newBook.stock,
                        bookImage: newBook.bookImage
                    },
                    (err, data) => {
                        if (err) {
                            res.status(503).send({
                                error: "Error while updating"
                            });
                            res.end();
                            return;
                        } else {
                            if (data == null) {
                                res.status(400).send({
                                    error: "The ID given do not exist"
                                });
                                res.end();
                                return;
                            } else {
                                if (
                                    oldBookImage != data.bookImage &&
                                    oldBookImage !=
                                    "./uploads/img/books-img/no-book-img.jpg"
                                ) {
                                    fs.unlink(oldBookImage, err => {
                                        if (err) {
                                            console.log(
                                                err.message +
                                                "error while deleting book image: " +
                                                oldBookImage
                                            );
                                        }
                                    });
                                }
                                next();
                            }
                        }
                    }
                );
            }
        });
    },
    manageDeleteBook: function (req, res, next) {
        if (!req.body._id.match(/^[a-fA-F0-9]{24}$/)) {
            res.status(400).send({ error: "Invalid book ID" });
            res.end();
            return;
        }
        Book.findByIdAndDelete(req.body._id, (err, data) => {
            if (err) {
                res.status(503).send({ error: "Error while deleting" });
                res.end();
                return;
            } else {
                if (data === null) {
                    res.status(503).send({
                        error: "The ID given do not exist"
                    });
                    res.end();
                    return;
                } else {
                    if (!data.bookImage != "./uploads/img/books-img/no-book-img.jpg") {
                        fs.unlink(data.bookImage, err => {
                            if (err) {
                                console.log(
                                    err.message +
                                    "error while deleting book image: " +
                                    data.bookImage
                                );
                            }
                            next();
                        });
                    }
                }
            }
        });
    },
    isAdmin: function (req, res, next) {
        if (!res.locals.admin) {
            res.status(403).send({ error: "You are not an administrator" });
            res.end();
            return;
        }
        next();
    }
};
