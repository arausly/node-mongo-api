const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {
	ObjectID
} = require('mongodb');

const {
	Todo
} = require('./models/todo.js');
const {
	User
} = require('./models/user.js');

require('./config.js');


const {
	mongoose
} = require('./db/mongoose.js');

const {
	authenticate
} = require('./middleware/authenticate');

let app = express();

let port = process.env.PORT;

// exposes function factories that populate the body of your req
app.use(bodyParser.json());

app.post('/todos', (req, res, next) => {
	let todo = new Todo({
		text: req.body.text
	})

	todo.save().then((docs) => {
		res.status(200).send(docs);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res, next) => {
	Todo.find().then((todos) => {
		res.status(200).send({
			todos
		});
	}, (err) => {
		res.status(400).send(err);
	});
})


app.get('/todos/:id', (req, res, next) => {
	let id = req.params.id;
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({
			todo
		});
	}).catch(e => res.status(400).send());

})

//any http method can be used to update or modify db
// but these ara best practices 

app.patch('/todos/:id', (req, res, next) => {
	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) {
		res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completedAt = null;
		body.completed = false;
	}

	Todo.findByIdAndUpdate(id, {
		$set: body
	}, {
		new: true
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({
			todo
		})
	}).catch(e => {
		res.status(400).send();
	});
});


app.delete('/todos/:id', (req, res, next) => {
	let id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findByIdAndRemove(id).then(todo => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({
			todo
		});
	}).catch(e => res.status(400).send());
})


//user signs up, should have to login again, give user a token.

app.post('/users', (req, res, next) => {
	let body = _.pick(req.body, ['email', 'password']);
	let user = new User(body);

	user.save().then(() => {
		return user.genAuthenticToken();
	}).then(token => {
		res.header('x-auth', token).status(200).send(user);
	}).catch(err => res.status(400).send(err));
});


//401- authentication is required,
//it's not good practice for your servers to respond with too much info when errors occur.
//it could results in session hijacking, source forgery.

app.get('/user/me', authenticate, (req, res, next) => {
	res.status(200).send(req.user);
});

app.post('/user/login', (req, res, next) => {
	let body = _.pick(req.body, ['email', 'password']);
	User.findByCredentials(body.email, body.password).then(user => {
		return user.genAuthenticToken().then(token => {
			res.header('x-auth', token).status(200).send(user);
		})
	}).catch(err => {
		res.status(400).send()
	})
});


app.listen(port, () => {
	console.log(`Server is Starting on port ${port}`);
});


module.exports = {
	app
};