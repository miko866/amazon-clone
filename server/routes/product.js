const router = require('express').Router();
const Product = require('../models/product');

const upload = require('../middlewares/upload-photo');

// POST - create new product
router.post('/products', upload.single('photo'),  async (req, res) => {
	try {
		let product = new Product();

		product.ownerID = req.body.ownerID;
		product.categoryID = req.body.categoryID;
		product.price = req.body.price;
		product.title = req.body.title;
		product.description = req.body.description;
		product.photo = req.file.location;
		product.stockQuantity = req.body.stockQuantity;

		await  product.save();

		res.json({
			status: true,
			message: "Successfully saved"
		})
	} catch (error) {
		console.error('Error from POST product: ', error);
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})
// GET - get all product
router.get('/products', async (req, res) => {
	try {
		let products = await Product.find().populate('owner category').exec();
		res.json({
			success: true,
			products: products
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

// GET - get a single product
router.get('/products/:id', async (req, res) => {
	try {
		let product = await Product.findOne({ _id: req.params.id }).populate('owner category').exec();
		res.json({
			success: true,
			product: product
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

// PUT - update a single product
router.put('/products/:id', upload.single('photo'), async (req, res) => {
	try {
		let product = await Product.findOneAndUpdate({ _id: req.params.id }, {
			$set: {
				title: req.body.title,
				price: req.body.price,
				category: req.body.categoryID,
				photo: req.file.location,
				description: req.body.description,
				owner: req.body.ownerID
			}
		},
		{upsert: true}
		);

		res.json({
			success: true,
			updateProduct: product
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

// DELETE - delete a single product
router.delete('/products/:id', async (req, res) => {
	try {
		let  deleteProduct = await Product.findOneAndDelete({ _id: req.params.id });

		if (deleteProduct) {
			res.json({
				status: true,
				message: "Successfully deleted"
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

module.exports = router;





