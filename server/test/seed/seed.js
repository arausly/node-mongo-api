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



const userOne = new ObjectID();
const userTwo = new ObjectID();

const users = [
	{
		_id: userOne,
		email: "arausid@yahoo.com",
		password: "semper435",
		tokens: [{
			access: "auth",
			token: jwt.sign({
				_id: userOne,
				access: this.access
			}, process.env.SECRET).toString(),
		}]
	},
	{
		_id:userTwo,
		email: "ovuo@yahoo.com",
		password: "ovuo123",
		tokens: [{
			access: "auth",
			token: jwt.sign({
				_id: userTwo,
				access: this.access
			}, process.env.SECRET).toString(),
		}]
	}
]

const todos = [
	{
		_id: new ObjectID(),
		text: "start chat app using nodejs",
		completed: true,
		completedAt: 5637,
		_creator: userOne

	},
	{
		_id: new ObjectID(),
		text: "start react-native",
		completed: false,
		_creator: userTwo
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

		return Promise.all([daniel, mum]);
	}).then(() => done());
}


module.exports = {
	todos,
	populateTodos,
	populateUsers,
	users,
};
