//VALIDATION
const Joi = require('@hapi/joi');

//register validation
const registerValidation = data => {
	//newer version of Joi uses Joi.object
	const schema = Joi.object({
		//Joi => type string, min chars 6, is required
		name: Joi.string()
			.min(6)
			.required(),
		email: Joi.string()
			.min(6)
			.required()
			.email(),
		password: Joi.string()
			.min(8)
			.required()
	});
	return schema.validate(data); //Joi.validate(data, schema); //older version
};

//login validation
const loginValidation = data => {
	//newer version of Joi uses Joi.object
	const schema = Joi.object({
		//Joi => type string, min chars 6, is required
		email: Joi.string()
			.min(6)
			.required()
			.email(),
		password: Joi.string()
			.min(8)
			.required()
	});
	return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;