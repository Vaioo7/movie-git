const booking = require("../../../src/models/booking");
const movie = require("../../../src/models/movie");
const register = require("../../../src/models/register");
const jwt = require("jsonwebtoken");

//------------------------------------------------------------- add_movie

module.exports.book = async (req, res) => {
    try {
        // console.log(req.params.id);
        const id = req.params.id;
        const { token } = req.cookies;

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await register.findById(decodedData.id);

        const { price, seat } = req.body;

        const movies = await movie.findById(id);
        if (!movies) {
            console.log("movie not found");
        }

        const existingBooking = await booking.findOne({
            user: req.user._id,
            movie: movies._id
        });

        if (existingBooking) {
            // Update existing booking
            existingBooking.price = price;
            existingBooking.seat = seat;
            await existingBooking.save();
        } else {
            // Create new booking
            await booking.create({
                user: req.user._id,
                movie: movies._id,
                price,
                seat
            });
        }
    } catch (error) {
        console.log(error);
        console.log('error');
        return res.redirect('back');
    }
};

module.exports.addtocart = async (req, res) => {
    // const id = req.body.id;
    // console.log(id);
    return res.redirect('/');
}

//------------------------------------------------------------- show_movie

module.exports.mymovie = async (req, res) => {
    try {

        const { token } = req.cookies;

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedData);
        req.user = await register.findById(decodedData.id);
        // console.log(req.user.id);

        let data = await booking.find({ user: req.user._id }).populate('user').populate('movie').exec();
        // console.log(data);
        let userId;
        data.forEach((order) => {
            userId = order.user.id;
        });

        if (req.user.id == userId) {
            return res.render('your_movie', {
                record: data,
            });
        } else {
            return res.redirect('/category');
        }

    } catch (error) {
        console.log(error);
        console.log("err");
        return res.redirect('/');
    }
}