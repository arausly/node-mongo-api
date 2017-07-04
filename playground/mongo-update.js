const {
	MongoClient,
	ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to Server');
	}
	console.log('Connected to MongoDB Server');

	//	db.collection('Todos').findOneAndUpdate({
	//		_id: new ObjectID('594fb2014f7dcbcca7722375')
	////	}, {
	////		$set: {
	////			completed: true
	////		}
	////	}, {
	////		returnOriginal: false,
	////	}).then((res)=>{
	////		console.log(res);
	////	});
	//		
	//	db.collection('Todos').deleteOne({_id:new ObjectID('594fb24a4f7dcbcca77223a1')});
	//	db.collection('Todos').findOneAndUpdate({
	//		_id: new ObjectID("594f74de4f7dcbcca7720cb3")
	//	},{
	//		$set:{
	//			completed:true
	//		}
	//	},{
	//		returnOriginal:false
	//	},(res)=>{
	//		console.log(res);
	//	});

	db.collection('Users').findOneAndUpdate({
		_id:new ObjectID("594f712dfba1df11b440f108")
	}, {
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((res)=>{
		console.log(res);
	})
	db.collection('Users').findOneAndUpdate({
		_id:new ObjectID("594f712dfba1df11b440f108")
	}, {
		$set: {
			name: "Arausi Daniel"
		}
	}, {
		returnOriginal: false
	}).then((res)=>{
		console.log(res);
	})
});
