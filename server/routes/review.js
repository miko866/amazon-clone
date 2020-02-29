const router = require('express').Router();
const Review = require('../models/review')
const Product = require('../models/product')
const verifyToken = require('../middlewares/verify-token')
const upload = require('../middlewares/upload-photo');

router.post('/reviews/:productID', [verifyToken, upload.single('photo')],  async (req, res) => {
	try {
		const review = new Review();
		review.headline = req.body.headline;
		review.body = req.body.body;
		review.rating = req.body.rating;
		review.photo = req.body.location;
		review.user = req.body.decoded._id;
		review.productID = req.params.productID;

		await Product.update({$push: review._id})

		const savedReview = await review.save();

		if(savedReview) {
			res.status(200).json({
				success: true,
				message: 'Successfully added review'
			})
		}

	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

router.get('/reviews/:productID', async(req, res) => {
	try {
		const productReviews = await Review.find({
			productID: req.params.productID
		}).populate('user').exec();

		res.status(200).json({
			success: true,
			message: productReviews
		})
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

module.exports = router;
