const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation'); //specified import from validation.js

//REGISTRATION
router.post('/register', async (req,res) => {
	//validate data before user creation
	//const validation = Joi.validate(req.body, schema); //older version
	//const {error} = schema.validate(req.body); //newer version

	const {error} = registerValidation(req.body);

	//if there is an error you won't proceed to creating user instead you get error message in JSON format
	//and then you pull it from [error > first array in details > message] and view only the error 
	if(error) return res.status(400).send(error.details[0].message);

	//Checking if the user is already in the database
	const emailExists = await User.findOne({email: req.body.email}); //checks if there is already an email with that name in DB
	if(emailExists) return res.status(400).send('Email already exists');

	//Hash the password
	const hashedPassword = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10)); //10 => salt work factor

	//Crete new user
	//make req, req.body.name => REST body
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});
	//check for errors
	try {
		const savedUser = await user.save();
		res.send({user: user._id}); //with req we'll be displaying just user ID but everything will still be saved into DB
	} 
	catch(err) {
		res.status(400).send(err);
	}
});

//LOGIN
router.post('/login', async (req,res) => {
	//validate data before user creation
	//const validation = Joi.validate(req.body, schema); //older version
	//const {error} = schema.validate(req.body); //newer version

	const {error} = loginValidation(req.body);

	//if there is an error you won't proceed to creating user instead you get error message in JSON format
	//and then you pull it from [error > first array in details > message] and view only the error 
	if(error) return res.status(400).send(error.details[0].message);

	//Checking if the email is correct
	const user = await User.findOne({email: req.body.email}); //checks if there is already an email with that name in DB
	if(!user) return res.status(400).send('There was a problem with your login, \n Email is not found');

	//Checking if the password is correct
	const validPass = await bcrypt.compare(req.body.password, user.password) //Compare encrypted stored in DB with encrypted stored in bcrypt
	if(!validPass) return res.status(400).send('There was a problem with your login, \n Password is wrong');

	//Create and assign a token
	const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET); //assign user ID to token and process token from env
	res.header('auth-token', token).send(token); //adds token to a header

	res.send('Logged in!');
});


module.exports = router;