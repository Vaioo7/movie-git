const register = require("../../../src/models/register");
const booking = require("../../../src/models/booking");
const movie = require("../../../src/models/movie")
const catchAsyncErrors = require("../../../src/middleware/catchAsyncErrors");
const sendToken = require("../../../utils/jwtToken");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");

module.exports.home = async (req, res) => {
    res.render("desh_index")
}

module.exports.createmovipage = async (req, res) => {
    res.render("desh_createmovie")
}

module.exports.createmovie = async (req, res) => {

    try {

        const { name, rating, language, length, category, country, release_date, description } = req.body;

        req.body.user = req.user.id;
        // console.log(req.body.user);

        const file = req.files.avatar
        console.log(file);

        const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "movie",
        });

        let avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        console.log(avatar);

        const data = await movie.create({
            name, rating, language, category, length, country, release_date, description, avatar
        });

        console.log(data);
        return res.redirect('/home')


    } catch (error) {
        console.log(error);
        console.log('error');
        return res.redirect('back');
    }

}

module.exports.bookedmovie = async (req, res) => {
    try {

        let data = await booking.find({}).populate('user').populate('movie').exec();

        if (data) {
            return res.render('desh_allmovie', {
                'record': data,
            });
        }
        else {
            console.log("record not found");
            return res.redirect('/');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

//------------------------------------------------------------- register

exports.register = catchAsyncErrors(async (req, res) => {
    
    const existingToken = req.cookies.token;
    if (existingToken) {
        console.log('User already has an active session.');
        return res.redirect('/');
    }
    return res.render('register')
})

exports.registerpost = catchAsyncErrors(async (req, res, next) => {
    try {
        await register.create(req.body);
        res.redirect('/login');

    } catch (error) {
        console.log(error);
        console.error("err");
        return res.redirect('back');
    }
});

//------------------------------------------------------------- login

exports.login = catchAsyncErrors(async (req, res, next) => {
    const existingToken = req.cookies.token;
    if (existingToken) {
        console.log('User already has an active session.');
        return res.redirect('/');
    }
    return res.render('login')
});

exports.loginpost = catchAsyncErrors(async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Please Enter Email & Password");
        }

        const user = await register.findOne({ email }).select("+password");

        if (!user) {
            console.log("Invalid email or password");
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (isPasswordMatched) {

            console.log("login succesfully..!!");
            sendToken(user, 200, res);
            return res.redirect('/');
        }
        console.log("Invalid email or password");
        res.redirect('back')

    } catch (error) {
        console.log(error);
        console.error("err");
        return res.redirect('back');
    }
})

//------------------------------------------------------------- change-password

module.exports.password = (req, res) => {
    return res.render('password')
}

module.exports.chnagepassword = async (req, res) => {
    try {

        const { token } = req.cookies;
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await register.findById(decodedData.id);

        const pass = req.body.pass;
        let isPasswordMatched = await bcrypt.compare(pass, req.user.password);
        const npass = req.body.npass;
        const cpass = req.body.cpass;

        if (isPasswordMatched) {
            if (pass != npass) {
                if (npass == cpass) {

                    await register.findByIdAndUpdate(req.user.id, {
                        password: await bcrypt.hash(npass, 10)
                    })
                    return res.redirect('/logout');
                }
                else {
                    console.log("new password & confirm password are not match..!!");
                    res.redirect("back");
                }
            }
            else {
                console.log("old password & new password are match..!!");
                res.redirect("back");
            }
        }
        else {
            console.log("old password are not match..!!");
            res.redirect("back");
        }

    } catch (error) {
        console.log(error);
        console.log("error");
    }
}

//----------------------------------------------------------------------- lost-password

module.exports.lostpass = function (req, res) {
    res.render('lostpassword');
}


module.exports.lostpassword = async function (req, res) {
    // console.log(req.body.email);
    try {

        const email = req.body.email;

        let data = await register.findOne({ email })
        if (data) {
            var otp = Math.floor(Math.random() * 10000);
            var transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "5ea61199c7d412",
                    pass: "99112cf7545f68"
                }
            });

            let info = await transporter.sendMail({
                from: 'vaibhavviradiya786@gmail.com', // sender address
                to: data.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>here is your otp :${otp}</b>`, // html body
            });

            res.cookie('otp', otp);
            res.cookie('email', req.body.email);

            return res.redirect('/checkOtp')

        }

        console.log("please enter valid email");
        return res.redirect('/lostpass');

    } catch (error) {
        console.log("error");
        return res.redirect('/lostpass');
    }
}


module.exports.checkOtp = function (req, res) {
    return res.render('checkotp')
}


module.exports.verifyOtp = async function (req, res) {
    // console.log(req.cookies.otp);
    // console.log(req.body.otp);
    try {

        const otp = req.body.otp;
        const cookieotp = req.cookies.otp;
        if (cookieotp == otp) {
            return res.redirect('/generateNewPass');

        } else {
            console.log("OTP are not match....");
            return res.redirect('/checkOtp');
        }

    } catch (error) {
        console.log("somthing wrong");
        return res.redirect('/lostpass');
    }
}

module.exports.generateNewPass = function (req, res) {
    return res.render('generatePass');
}

module.exports.resetPassword = async function (req, res) {

    try {
        const npass = req.body.npass;
        const cpass = req.body.cpass;

        if (npass == cpass) {
            let data = await register.findOne({ email: req.cookies.email });

            if (data) {
                var updatepass = await register.findByIdAndUpdate(data.id, {
                    password: await bcrypt.hash(npass, 10)
                });
                if (updatepass) {

                    console.log("success ! password change successfully..👌👍");
                    res.cookie('otp', '');
                    res.cookie('email', '');
                    return res.redirect('/logout');

                } else {

                    console.log("data not found..!!");
                    return res.redirect('/generateNewPass');
                }
            } else {

                console.log('data not found try another email..!!');
                return res.redirect('/generateNewPass');
            }
        }
        else {
            console.log('new password & confirm password are not match..!!');
            return res.redirect('/generateNewPass');
        }

    } catch (error) {
        console.log('somthing wrong');
        return res.redirect('/generateNewPass');
    }

}

//------------------------------------------------------------------------------- profile

module.exports.profile = async (req, res) => {

    const { token } = req.cookies;

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedData);
    req.user = await register.findById(decodedData.id);
    // console.log(req.user);

    return res.render('profile', {
        'record': req.user,
    })
}

module.exports.Editprofile = async function (req, res) {
    return res.render('profileEdit');
}

module.exports.Editprofilepage = async (req, res) => {
    try {
        // console.log(req.avatar);

        const { token } = req.cookies;
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await register.findById(decodedData.id);

        const { gender, DOB } = req.body;

        const user = await register.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const file = req.files.avatar

        const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "movieavatars",
            width: 150,
            crop: "scale",
        });

        let avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };

        await register.findByIdAndUpdate(req.user.id, {
            gender, DOB, avatar
        });

        res.redirect('/profile');

    } catch (error) {
        console.log(error);
        console.log("err");
        res.redirect('back');
    }
};