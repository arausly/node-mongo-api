const mongoose = require('mongoose');
const {Schema} = require('mongoose');

let todoSchema = new Schema({
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim:true
	},


	completed: {
		type: Boolean,
		default:false,
	},


	completedAt: {
		type: Number,
		default:null,
	},
    _creator:{
		type:Schema.Types.ObjectId,
		required:true,
	}
});


let Todo = mongoose.model('Todo',todoSchema);

module.exports = {Todo}

//schema.type.objectId is used to set a type property to the objectid's type.when i want a property to look like an object id then i set it to mongoose.schema.type.ObjectId