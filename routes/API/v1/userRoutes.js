const express = require("express");
const { movie, addproduct, category, ticketbooking } = require("../../../controllers/API/v1/usercontrollers");
const routes = express.Router();
const { isAuthenticatedUser } = require("../../../src/middleware/auth");


routes.route('/').get(movie);

routes.route('/addmovie/:id').get(isAuthenticatedUser,addproduct);

routes.route('/category').get(category);

routes.route('/ticketbooking/:id').get(ticketbooking);

module.exports = routes;

