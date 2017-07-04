const {
	MongoClient,
	ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('unable to connect to mongoDB');
	}
	console.log('Connected to mongoDB');


	//  db.collection('Todos').deleteMany({text:"start react-native"}).then((result)=>{
	//	  console.log(result);
	//  })
	//  db.collection('Todos').deleteMany({text:"finish mongo tutorial"}).then((result)=>{
	//	  console.log(result);
	//  })
	//  db.collection('Todos').deleteOne({text:"create subtraction functionality for calculator"}).then((res)=>{
	//	  console.log(res);
	//  });
	//	db.collection('Todos').deleteOne({text:"this is no 1 todo"}).then((res)=>{
	//		console.log(res);
	////	});
	////	
	//	db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
	//		console.log(result);
	//	})

	db.collection('Users').deleteMany({
		name: "Arausi Daniel"
	}).then((res) => {
		console.log(res);
	})
	
	db.collection('Users').findOneAndDelete({_id:ObjectID('594f71586f1aba142c4fa49d')}).then((res)=>{
		console.log(res);
	});
});
