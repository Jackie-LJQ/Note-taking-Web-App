const express=require('express')
const app=express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
var uri = 'mongodb://localhost:27017'
const PORT = 8000
// console.log(uri)
const {MongoClient, ObjectId} = require('mongodb')
MongoClient.connect(uri, (err,mongoConnect)=>{
    if (err){
        // console.log(err)
        process.exit(5)        
    }
    dataBase = mongoConnect.db('notesWebApp')
    app.listen(PORT)
    console.log(`Server started, port ${PORT}`)
})

async function registerUser(params) {
    let email = params.email
    let userName = params.username
    let passWord = params.password
    let existUser = await dataBase.collection("user").find({'email':email}).toArray()
    if (existUser.length!=0) {
        return [`${email} has registered. Please use login!`, null]
    }
    
    let res = await dataBase.collection("user").insertOne({'email':email, 'userName':userName, "password":passWord})
    let Uid = await res.insertedId.toString();
    return [null, Uid]
}

app.get('/api/ping', (req, res, next)=>{
    res.writeHead(200)
    res.write("Hello from server!\n")
    res.end()
    next()
})

app.get('/api/login', (req, res, next)=>{
    res.writeHead(200)
    res.write("login page")
})

app.post('/api/login', (req, res, next)=>{
    // curl -X POST -H "Content-Type: application/json" -d '{"email":"123@gmail.com", "password":"123"}' http://localhost:3000/login

})

app.post('/api/register', (req, res, next)=>{
    // curl -X POST -H "Content-Type: application/json" -d '{"email":"123@gmail.com","username":"jq", "password":"123"}' http://localhost:3000/register
    try {
        registerUser(req.body).then((ret)=>{
            let message = ret[0]
            let Uid = ret[1]
            if (message) {
                res.writeHead(202)
                res.write("Register Failed. " + message + "\n")
                res.end()
            }
            else {
                // res.redirect(303, `/user/${Uid}`)
                res.writeHead(200)
                res.write(`User ${Uid} registered successfully!\n`)
                res.end()                
            }
            next()             
        })
        
    } catch(err) {
        throw err
    }
})

app.get("/api/note/:noteId", (req, res, next)=>{
    
})