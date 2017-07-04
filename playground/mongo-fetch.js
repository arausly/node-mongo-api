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
	
//	db.collection('Todos').find({_id:new ObjectID()}).toArray().then((docs) => {
//		console.log(` Todos \n ${JSON.stringify(docs,undefined,2)}`)
//	}, (err) => {
//		console.log('Cannot find Todos document');
//	});
	//	db.close();
	
	
	
		db.collection('Users').find({name:"Arausi Daniel"}).count((err,count)=>{
		if(err){
			return console.log('Cannot Get Todos Count',err);
		}
		console.log(`Users count: ${count}`);
	});
	
		db.collection('Users').find({name:"Arausi Daniel"}).toArray((err,docs) =>{
		if(err){
			return console.log('Unable to get Todos',err)
		}
		console.log(`Users \n ${JSON.stringify(docs,undefined,2)}`);
	});
	
})
