//const MongoClient = require('mongodb').MongoClient;

const {
	MongoClient,
	ObjectID
} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect', err);
	}

	console.log('Connected to mongodb server');

//	db.collection('Todos').insertOne({
//		text: "finish mongo tutorial",
//		completed: false
//	}, (err, result) => {
//		if (err) {
//			return console.log('Could not create collection successfully', err);
//		}
//
//		console.log(JSON.stringify(result.ops, undefined, 2));
//	})
//
//	db.collection('Users').insertOne({
//		name: "Arausi Daniel",
//		age: 19,
//		location: "Nigeria"
//	}, (err, result) => {
//		if (err) {
//			return console.log('Unable to insert new document', err);
//		}
//
//		console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//	})

	db.collection('test').insertMany([{
		_id: new ObjectID(),
		content: "first test"
	}, {
		_id: new ObjectID(),
		content: "second test"
	}, {
		content: "third test without ObjectID constructor",
	}], (err, result) => {
		if (err) {
			return console.log('Unable to create documents for the collection');
		}
		console.log(`Created documents @ ${JSON.stringify(result.ops[0]._id.getTimestamp())}`);
	});

	db.close();
})