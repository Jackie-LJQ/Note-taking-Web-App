const express=require('express');
const app=express();
var uri = 'mongodb://localhost:27017';
const PORT = 3000;
// console.log(uri);
const {MongoClient, ObjectId} = require('mongodb');
MongoClient.connect(uri, (err,mongoConnect)=>{
    if (err){
        // console.log(err)
        process.exit(5);        
    }
    dataBase = mongoConnect.db('notesWebApp');
    app.listen(PORT);
    console.log(`Server started, port ${PORT}`);
});

function registerUser(params) {
    let email = params.email;
    let userName = params.name;
    let passWord = params.password;
    let existUser =  dataBase.collection("user").find({'email':{$eq:email}}).toArray();
}

app.post('/register', (req, res, next)=>{
    try {
        registerUser(req.query).then((invalidFields, Uid)=>{
            if (invalidFields.length==0) {
                res.redirect(303, `/user/${Uid}`);
                res.end();
            }
            else {
                res.writeHead(422);
                res.write("Register Failed: " + invalidFields.join(" "));
                res.end();
            }  
            next();             
        });
        
    } catch(err) {
        throw err;
    }
})