const express = require('express');
const bodyParser = require('body-parser');
const {
	ObjectID
} = require('mongodb');

const {
	mongoose
} = require('./db/mongoose');
const {
	Todo
} = require('./models/todo.js');
const user = require('./models/user.js');


let app = express();

let port = process.env.PORT || 3000;

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
   if(!ObjectID.isValid(id)){
	   res.status(404).send();
   }
	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send(todo);
	}).catch(e => res.status(400).send());
	
})

app.listen(port, () => {
	console.log(`Server is Starting on port ${port}`);
});

module.exports = {
	app
};
