const movie = require("../../../src/models/movie");
const register = require("../../../src/models/register");
const catchAsyncErrors = require("../../../src/middleware/catchAsyncErrors");
const ApiFeatures = require('../../../utils/apifeatures');

exports.movie = catchAsyncErrors(async (req, res) => {
    try {
        const lastThreeData = await movie.find().sort({ _id: -1 }).limit(4);
        // let lastThreeData = await movie.find({});
        if (lastThreeData) {
            return res.render('index', {
                lastThreeData
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
})

module.exports.category = async (req, res) => {
    const resultPerPage = 8;
    //   const productsCount = await myproduct.countDocuments();

    const apiFeature = new ApiFeatures(movie.find(), req.query)
        .search()
        .pagination(resultPerPage);

    try {
        let data = await apiFeature.query;
        if (data) {
            return res.render('movie_category', {
                'record': data
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

//------------------------------------------------------------- show_movie_details

module.exports.addproduct = async (req, res) => {

    let data = await movie.findById(req.params.id);
    // console.log(req.params.id);
    return res.render('movie_details', {
        record: data
    });

}


module.exports.ticketbooking = async (req, res) => {
    let data = await movie.findById(req.params.id);

    return res.render('ticket_booking', {
        record: data
    });
}
