const {mongoose} = require('./../server/db/mongoose');
const {ObjectID} = require('mongodb');

const {Todo} = require('../server/models/todo.js');

//Todo.remove({}) remove all
//Todo.findOneAndRemove() removes the first match
////Todo.findByIdAndremove() removes the first match
//

//
//Todo.findByIdAndRemove("595baaa6046c361a14ec2de3").then(todo =>{
//	console.log('deleted todo: ',todo);
//});
//
//(new Todo({
//	text:"start something new",
//})).save().then(doc=>console.log('save todo : ',doc));
//
//
//

Todo.findOneAndRemove({_id:"595bad87254808111c5f8351"}).then(todo =>{
	todo.save().then(doc => console.log('Nigga you were deceived'));
})