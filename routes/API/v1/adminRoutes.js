const express = require("express");
const { register, registerpost, login, loginpost, home, createmovipage, createmovie, bookedmovie, password, chnagepassword, lostpass, lostpassword, verifyOtp, checkOtp, generateNewPass, resetPassword, profile, Editprofile, Editprofilepage } = require("../../../controllers/API/v1/admincontrollers");
const routes = express.Router();
const { authorizeRoles, isAuthenticatedUser } = require("../../../src/middleware/auth");

routes.route('/register')
    .post(registerpost)
    .get(register);

routes.route('/login')
    .get(login)
    .post(loginpost);


routes.route('/home').get(isAuthenticatedUser, authorizeRoles("admin"), home);

routes.route('/create_movie')
    .get(isAuthenticatedUser, authorizeRoles("admin"), createmovipage)
    .post(isAuthenticatedUser, authorizeRoles("admin"), createmovie);

routes.route('/bookedmovie')
    .get(isAuthenticatedUser, authorizeRoles("admin"),bookedmovie)

routes.get('/logout', function (req, res) {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return res.redirect('/login');
})


//profile
routes.route('/profile').get(isAuthenticatedUser,profile);
routes.route('/Editprofile').get(isAuthenticatedUser,Editprofile);
routes.route('/Editprofilepage').post(isAuthenticatedUser,Editprofilepage);


//change password
routes.route('/password').get(isAuthenticatedUser,password);
routes.route('/chnagepassword').post(isAuthenticatedUser,chnagepassword);


//lost password
routes.route('/lostpass').get(lostpass);
routes.route('/lostpassword').post(lostpassword);


//otp check
routes.route('/checkOtp').get(checkOtp);
routes.route('/verifyOtp').post(verifyOtp);


//generateNewPass
routes.route('/generateNewPass').get(generateNewPass);
routes.route('/resetPassword').post(resetPassword);

module.exports = routes;

