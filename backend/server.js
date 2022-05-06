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

async function postNote(title, content, author, noteId) {
    let newNoteId
    if (noteId) {
        //update note: update note doesn't change the author
        await dataBase.collection("notes").updateOne({"_id":new ObjectId(noteId)}, {$set:{"title":title, "content":content}})
        newNoteId = noteId
    }
    else {
        //create note: share group only contains author when create a new note
        let res = await dataBase.collection("notes").insertOne({"title":title, "content":content, "author":author, "group":[]})
        newNoteId = await res.insertedId.toString()
        
    }
    await dataBase.collection("notes").updateOne({"_id":new ObjectId(newNoteId)}, {$set:{"timeStamp":new Date()}})
    return newNoteId
}

async function getNote(noteId) {
    let note = await dataBase.collection("notes").find({"_id":new ObjectId(noteId)}).toArray()
    if (note.length===0) {
        return null
    }
    return note[0]
}

async function getUserByEmail(email) {
    let user = await dataBase.collection("user").find({'email':email}).toArray()
    if (user.length===0) {
        return null
    }
    return user[0]
}

app.get('/api/ping', (req, res, next)=>{
    res.writeHead(200)
    res.write("Hello from server!\n")
    res.end()
    next()
})

app.post('/api/login', async (req, res, next)=>{
    // curl -X POST -H "Content-Type: application/json" -d '{"email":"123@gmail.com", "password":"123"}' http://localhost:3000/login
    // db.user.find({"email":"jiaqi@usc.edu"})
    try {
        let email = req.body.email
        let passWord = req.body.password
        let existUser = getUserByEmail(email)
        if (!existUser) {
            res.writeHead(406)
            res.write("Account doesn't exists. Please register.")
            res.end()
            return next()            
        }
        if (existUser.password !== passWord) {
            res.writeHead(400)
            res.write("Password is incorrect.")
            res.end()
        }
        else {
            const user = {
                id: existUser._id.toString(),
                name: existUser.userName,
                email: existUser.email
            }
            console.log(user)
            res.writeHead(200)
            res.write(JSON.stringify(user))
            res.end()
        }
        next()
    } catch(err) {
        throw err
    }
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
                const user = {
                    id: Uid.toString(),
                    name: req.body.username,
                    email: req.body.email
                }
                res.writeHead(200)
                res.write(JSON.stringify(user))
                res.end()                
            }
            next()             
        })
        
    } catch(err) {
        throw err
    }
})

app.get("/api/notes/:userId", async (req, res, next) => {
    try {
        let notes = await dataBase.collection("notes").find({"author": req.params.userId}).toArray()
        notes = JSON.stringify(notes);
        res.writeHead(200);
        res.write(notes);
        res.end();
    } catch (err) {
        throw err;
    }
})

app.get("/api/note/:noteId", async (req, res, next)=>{
    try {
        const noteId = req.params.noteId
        let note = await getNote(noteId)
        if (!note) {
            res.writeHead(202)
            res.write("Note doesn't exist.")
            res.end()
        }
        else {
            note = JSON.stringify(note)
            res.writeHead(200)
            res.write(note)
            res.end()
        }
        next()
    } catch(err) {
        throw err
    }
})

// curl -X POST "http://localhost:8000/api/note/62739b3b44a5a324f4f68f6f"
app.post("/api/note/:noteId", async (req, res, next)=>{
    try {
        let title = req.body.title
        let content = req.body.content
        let noteId = await postNote(title, content, null, req.params.noteId)
        res.writeHead(200)
        res.write(noteId)
        res.end()
        next()
    } catch(err) {
        console.log(err)
    }
})

// curl -X POST "http://localhost:8000/api/create"
app.post("/api/createNew", async (req, res, next)=>{
    try {
        let author = req.body.author
        let noteId = await postNote("", "", author, null)
        res.writeHead(200)
        res.write(noteId)
        res.end()
        next()
    } catch(err) {
        console.log(err)
    }
})

app.delete("/api/note/:noteId", async(req, res, next)=>{
    try {
        let ret = await dataBase.collection("notes").deleteOne({"_id":new ObjectId(req.params.noteId)})
        if (ret.deletedCount===0) {
            res.writeHead(204)
        }
        else {
            res.writeHead(200)
        }
        res.end()
        next()
    }catch(err) {
        throw (err)
    }
})

app.post("/api/invite/:noteId", async (req, res, next)=>{
    try {
        let noteId = req.params.noteId
        let note = await getNote(noteId)
        if (!note) {
            res.writeHead(202)
            res.write("Note does not exist")
            res.end()
            return next()
        }
        if (note.group.length===5) {
            res.writeHead(202)
            res.write("Share number exceeds maximum of 5.")
            res.end()
            return next()
        }
        let guestEmail = req.body.guest
        let guest = await getUserByEmail(guestEmail)
        if (!guest) {
            res.writeHead(202)
            res.write("Guest does not exist.")
            res.end()
            return next()
        }
        if (note.group.includes(guestEmail)) {
            res.writeHead(202)
            res.write("Guest has been invited.")
            res.end()
            return next()
        }

        let newGroup = note.group
        newGroup.push(guestEmail)
        let updateRes = await dataBase.collection("notes").updateOne({"_id":new ObjectId(noteId)}, {$set:{"group":newGroup}})
        // console.log(newGroup.toString())
        if (updateRes.modifiedCount===1) {
            res.writeHead(200)
            res.write(newGroup.toString())
            res.end()
            next()
        }
        res.writeHead(202)    
        res.write("Something unknown happened, please try again.")
        res.end()
        next()
    }catch(err){
        throw(err)
    }
})