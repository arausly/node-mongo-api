const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('../server/models/todo.js');

let id = "595ac4dfcbe4271640d81c16";


if(ObjectID.isValid(id)){
	//Todo.find({
	//	_id:id
	//}).then((todos)=>{
	//	if(!todos){
	//		return console.log('cannot find todos');
	//	}
	//	console.log('todos',todos);
	//})
	////finds the first one with matching query 
	//
	//Todo.findOne({ 
	//	_id:id
	//}).then((todo)=>{
	//	 if(!todo){
	//		return console.log('cannot find todo');
	//	 }
	//	console.log(todo);
	//}); 

	Todo.findById(id).then((todo)=>{
		if(!todo){
			return console.log('cannot find todo by Id');
		}
		console.log('todo by id',todo);
	}).catch(e =>console.log(e));
}else{
	console.log('Id is invalid');
}