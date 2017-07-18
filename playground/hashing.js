const {SHA256} =  require('crypto-js'); 
const JWT = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs'); 

let password = "semper435";

// bcrypt.genSalt gen salt before it hashes.

bcrypt.genSalt(10,(err,salt) =>{
	bcrypt.hash(password,salt,(err,hash)=>{
		console.log(hash);
	})
})

