const {
	ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const {
	Todo
} = require('../../models/todo');
const {
	User
} = require('../../models/user');




const users = [
	{
		_id: new ObjectID(),
		email: "arausid@yahoo.com",
		password: "semper435",
		tokens: [{
			access: "auth",
			token: jwt.sign({
				_id: this._id,
				access: this.access
			},'secret').toString(),
		}]
	},
	{
		_id: new ObjectID(),
		email: "ovuo@yahoo.com",
		password: "ovuo123",
	}
]


const todos = [
	{
		_id: new ObjectID(),
		text: "start chat app using nodejs",
		completed: true,
		completedAt: 5637
	},
	{
		_id: new ObjectID(),
		text: "start react-native",
		completed: false
	}
];



const populateTodos = ((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos).then(() => {
			done();
		})
	})

});


//Promise.all waits till all the unresolved promises get resolves then fires anything chained to it;
const populateUsers = (done) => {
	User.remove({}).then(() => {
		let daniel = new User(users[0]).save();
		let mum = new User(users[1]).save();
		
	return Promise.all([daniel,mum]);
	}).then(()=> done());
}


module.exports = {
	todos,
	populateTodos,
	populateUsers,
	users,
};
