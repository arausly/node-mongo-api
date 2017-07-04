const expect = require('expect');
const superTest = require('supertest');
const {
	ObjectID
} = require('mongodb');

const {
	Todo
} = require('../models/todo');
const {
	app
} = require('../server');


const todos = [
	{
		_id: new ObjectID(),
		text: "finish nodejs"
	}, 
	{
		_id: new ObjectID(),
		text: "start react-native",
	}
];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos).then(() => {
			done();
		})
	})

});

describe('POST /todos', () => {
	it('should post todo data correctly to the db', (done) => {
		let text = "some text";
		superTest(app)
			.post('/todos')
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
			.expect((res) => {
			expect(res.body.todos.length).toBe(2);
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
			.expect(200)
			.expect((res)=>{
			 expect(res.body.todo.text).toBe(todos[0].text);
		})
			.end(done);
	});
	it('should return a 404  if todos not found for invalid id',(done)=>{
		superTest(app)
		.get('/todos/121')
		.expect(404)
		.end(done);
	});
	it('should return 404 for todos not found with valid id',(done)=>{
		superTest(app)
		.get(`/todos/${new ObjectID().toHexString()}`)
		.expect(404)
		.end(done);
	});
})
