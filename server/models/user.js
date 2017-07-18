const mongoose = require('mongoose');
const {
	Schema,
	model
} = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const validator = require('validator');


let userSchema = new Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: (value) => {
				validator.isEmail(value);
			},
			message: "{VALUE} is not a valid email",
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
	},
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}
	]
});



//here we overide an existing method on the methods objects, the toJSON method returns a json format of what ever is passed to it in this case the docs/document for the db. 

userSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
}


//create custom instance methods which have access to the individual methods
// arrow functions are not used here because of the this binding not accrued to it.which is necessary in accessing the doc.
// i believe i can find a way around this but i think it is far easier to rely this. 
// toString(16) === toHexString()

userSchema.methods.genAuthenticToken = function () {

	//keep in mind we have an object representing the user

	let user = this;
	let access = 'auth';
	let token = jwt.sign({
		_id: user._id.toHexString(),
		access
	}, 'secret').toString();

	// updating the tokens which is an array. hence updated using coventional array methods
	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => {      
		return token;
	});
};




// the model method accesses the User model directly and can make queries 

userSchema.statics.findByToken = function (token) {
	let User = this;
	let decodedJwtToken;

	try {
           decodedJwtToken = jwt.verify(token,'secret');
	} catch(err){
         return Promise.reject();
	}

   return User.findOne({
	   _id:decodedJwtToken._id,
	   "tokens.token":token,
	   "tokens.access":"auth"
   });
}


let User = mongoose.model('User', userSchema);

module.exports = {
	User
}
