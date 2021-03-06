const { body,validationResult } = require('express-validator');
var User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.create_user = [
	body('email',"Must be an email address").isEmail().trim().escape().normalizeEmail(),
	body('display_name',"Must be an email address").trim().escape(),
	body('password').isLength({min:8}).withMessage('Password must be at least 8 characters long.')
	.matches('[0-9]').withMessage('Password Must Contain a Number')
	.matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
	.trim().escape(),

	(req,res,next) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			res.status(422).json({
				errors: errors.array()
			});
			return;
		}

		else
		{
			bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
				if(err){return next(err)};

				const user = new User({
					email:req.body.email,
					display_name: req.body.display_name,
					password:hashedPassword
				}).save(err=>{
					if(err){
						return next(err);
					}

					console.log("user saved!");

					return res.json({
						email: req.body.email,
						password: hashedPassword,
						display_name: req.body.display_name,
					});
				});
			});
		}
	}



];