const expect = require('expect');
const superTest = require('supertest');
const {
	ObjectID
} = require('mongodb');

const {
	Todo
} = require('../models/todo');
const {
	User
} = require('../models/user');
const {
	app
} = require('../server');

const {
	populateTodos,
	populateUsers,
	users,
	todos,
} = require('./seed/seed.js');



beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should post todo data correctly to the db', (done) => {
		let text = "some text";
		superTest(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find({
					text
				}).then((todos) => {
					expect(todos[0].text).toBe(text);
					expect(todos.length).toBe(1).toBeA('number');
					done();
				}).catch((e) => done(e));
			})
	});

	it('should not create todo for invalid data', (done) => {
		let text = "";
		superTest(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text
			})
			.expect(400)
			.expect((res) => {
				expect(res.body.text).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch(e => done(e));
			})
	});
})


describe('GET /todos', () => {
	it('should return todo data', (done) => {
		superTest(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect((res) => {
				//why is this todos
				expect(res.body.todos.length).toBe(1);
			})
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch(e => done(e))
			})
	})
})

describe('GET /todos/:id', () => {
	it('should respond with corresponding todos for valid id', (done) => {
		superTest(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});
	it('should return a 404  if todos not found for invalid id', (done) => {
		superTest(app)
			.get('/todos/121')
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
	it('should return 404 for todos not found with valid id', (done) => {
		superTest(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
})

describe('DELETE /todos/:id', () => {
	it('should respond with deleted todo for valid id', (done) => {
		superTest(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then(todoss => {
					expect(todoss.length).toBe(1).toBeA('number');
					expect(todoss).toExclude(todos[1])
					done();
				}).catch(e => done(e))
			})
	});
	it('should not respond with a todo for valid id not found', (done) => {
		superTest(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	})
	it('should not respond for invalid todo', (done) => {
		superTest(app)
			.delete(`/todos/123`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	})
})
describe('PATCH /todos/:id', () => {
	it('should update todo with corresponding id', (done) => {
		let id = todos[0]._id;
		superTest(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				completed: false
			})
			.expect((res) => {
				expect(res.body.todo.completedAt).toBe(null);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(id).then((todo) => {
					expect(todo.completed).toBe(false);
					done();
				}).catch(e => done(e));
			})
	});
	it('should not update todo for invalid id', (done) => {
		superTest(app)
			.patch('/todos/123')
			.expect(401)
			.end(done)
	});
	it('should not update todo for unmatched todo', (done) => {
		superTest(app)
			.patch(`/todos/${new ObjectID().toHexString()}`)
			.expect(401)
			.end(done);
	})
})
describe('POST /users/login', () => {
	it('should login and return auth token for valid data', (done) => {

		superTest(app)
			.post('/user/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect(res => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body.email).toExist();
				expect(res.body._id).toExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.findOne({
					email: res.body.email
				}).then((user) => {
					expect(user.tokens.length).toBe(2);
					expect(user.tokens[0].token).toExist();
					expect(res.body.password).toNotBe(user.password);
					done();
				}).catch(err => done(err));
			});
	});

	it('should not login for invlaid data', (done) => {
		superTest(app)
			.post('/user/login')
			.send({
				email: users[1].email,
				password: users[0].password
			})
			.expect(400)
			.expect(res => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				User.findOne({
					email: users[1].email,
				}).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				}).catch(err => done(err));
			});
	})
});

describe('DELETE /user/me/token', () => {
	it('should logout user for valid token', (done) => {
		superTest(app)
			.post('/user/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err, res) => {
				if (err) {
					return done(err)
				}
				User.findById({
					_id: users[0]._id
				}).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch(err => done(err));
			})
	})
})
