const jwt = require('jsonwebtoken');

//when user log in the auth function will check if user has this token
//first it checks if you have any token, then it checks if the token is correct
function auth (req,res,next) {
	const token = req.header('auth-token'); //checks if header has the token
	if(!token) return res.status(401).send('Access Denied');

	try {
		//if the user token corresponds with TOKEN_SECRET then req.user is set to verified
		const verified = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verified;
	}
	catch (err) {
		res.status(400).send('Invalid Token');
	}
}