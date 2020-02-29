const router = require('express').Router()
const User = require('../models/user');
const verifyToken = require('../middlewares/verify-token');

const jwt = require('jsonwebtoken');

// Singup Route
router.post('/auth/signup', async (req, res) => {
	if(!req.body.email || !req.body.password) {
		res.json({success: false, message: "Please enter email or password"})
	} else {
		try {
			let newUser = new User();
			newUser.name = req.body.name;
			newUser.email = req.body.email;
			newUser.password = req.body.password
			await newUser.save()

			let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
				expiresIn: 604800 // 1 week
			})

			res.json({
				success: true,
				token: token,
				message: "Successfully created a new user"
			})
		} catch (error) {
			console.error(error);
			res.status(500).json({
				success: false,
				message: error.message
			})
		}
	}
})

// Profile Route
router.get('/auth/user', verifyToken, async (req, res) => {
	try {
		let foundUser = await User.findOne({_id: req.decoded._id});
		if (foundUser) {
			res.json({
				success: true,
				user: foundUser
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

// Update a profile
router.put('/auth/user', verifyToken, async(req, res) => {
	try {
		let foundUser = await User.findOne({ _id: req.decoded._id});

		if(foundUser) {
			if (req.body.name) foundUser.name = req.body.name
			if (req.body.email) foundUser.email = req.body.email
			if (req.body.password) foundUser.password = req.body.password

			await foundUser.save();

			res.status(200).json({
				success: true,
				message: 'Successfully updated'
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

// Login Route
router.post("/auth/login", async(req, res) => {
	try {
		let foundUser = await User.findOne({email: req.body.email});
		if (!foundUser) {
			res.status(403).json({
				success: false,
				message: "Authentication failed, User not found"
			})
		} else {
			if (foundUser.comparePassword(req.body.password)) {
				let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
					expiresIn: 604800 // 1 weak
				})

				res.json({success: true, token: token})
			} else {
				res.status(403).json({
					success: false,
					message: "Authentication failed, wrong password!"
				})
			}
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
})

module.exports = router;
