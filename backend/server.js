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
    
    let res = await dataBase.collection("user").insertOne({'email':email, 'userName':userName, "password":passWord, "sharedPage":[]})
    let Uid = await res.insertedId.toString();
    return [null, Uid]
}

async function postNote(title, content, author, noteId) {
    let newNoteId
    if (noteId) {
        //update note: update note doesn't change the author
        await dataBase.collection("notes").updateOne({"_id":new ObjectId(noteId)}, {$set:{"title":title, "content":content, "timeStamp":new Date()}})
        newNoteId = noteId
    }
    else {
        //create note: share group only contains author when create a new note
        let res = await dataBase.collection("notes").insertOne({"title":title, "content":content, "author":author, "group":[], "timeStamp":new Date()})
        newNoteId = await res.insertedId.toString()
    }
    return newNoteId
}

async function getNote(noteId) {
    if (noteId=="create") {
        return null
    }
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

async function shareNote(noteId, guestEmail) {
    let note = await getNote(noteId)
    let errMessage = null
    let sharedUser = null
    if (!note) {
        errMessage = "Note does not exist"
        return [errMessage, null]
    }
    if (note.group.length===5) {
        errMessage = "Share number exceeds maximum of 5."
        return [errMessage, null]
    }
    if (note.group.includes(guestEmail)) {
        errMessage = "Guest has been invited."
        return [errMessage, null]
    }
    let guest = await getUserByEmail(guestEmail)
    if (!guest) {
        errMessage = "Guest does not exist."
        return [errMessage, null]
    }
    
    let guestName = guest.userName
    let newGuestGroup = note.group
    newGuestGroup.push(guestName)
    let updateNote = await dataBase.collection("notes").updateOne({"_id":new ObjectId(noteId)}, {$set:{"group":newGuestGroup}})
    let guestId = guest._id
    let sharedPage = guest.sharedPage
    sharedPage.push(noteId)
    console.log(guestId)
    let updateGuest = await dataBase.collection("user").updateOne({"_id":new ObjectId(guestId)}, {$set:{"sharedPage":newSharedPage}})
    if (updateNote.modifiedCount===1 && updateGuest.modifiedCount===1) {
        sharedUser = newGroup.toString()
        return [null, sharedUser]
    }
    errMessage = "Something went wrong. Please try again."
    return [errMessage, null]
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
        let existUser = await getUserByEmail(email)
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
        let note = await getNote(req.params.noteId)
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
        let [errMessage, sharedUser] = await shareNote(req.params.noteId, req.body.guestEmail)
        if (errMessage) {
            res.writeHead(202)    
            res.write("Something unknown happened, please try again.")
            res.end()
            return next()
        }
        res.writeHead(200)
        res.write(sharedUser)
        res.end()
        return next()        
    }catch(err){
        throw(err)
    }
})