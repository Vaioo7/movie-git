const express = require("express");
const { book, addtocart, mymovie } = require("../../../controllers/API/v1/bookingController");
const routes = express.Router();
const { isAuthenticatedUser } = require("../../../src/middleware/auth");


routes.route('/book/:id').post(book);

routes.route('/addtocart').get(addtocart);

routes.route('/mymovie').get(isAuthenticatedUser,mymovie)

module.exports = routes;

