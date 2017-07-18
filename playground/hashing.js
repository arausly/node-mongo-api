const {SHA256} =  require('crypto-js'); 
const JWT = require('jsonwebtoken');
const {ObjectID} = require('mongodb');

let message= "some string";
let hash = SHA256(message).toString();



let  data = {
   id:5
}

let salt = new ObjectID().toString();

let token = JWT.sign(data,salt);

console.log(token);


