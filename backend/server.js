const { ObjectID } = require("bson");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var uri = "mongodb://localhost:27017";
const uri_docDB = 'mongodb://EE547:12345678@docdb-2022-05-07-23-01-41.cluster-c76bpesfobkc.us-west-2.docdb.amazonaws.com:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
const PORT = 8000;

const { MongoClient, ObjectId, ConnectionClosedEvent } = require("mongodb");
//MongoClient.connect(uri, (err, mongoConnect) => {
MongoClient.connect(uri_docDB, {tlsCAFile: `rds-combined-ca-bundle.pem`},(err, mongoConnect) => {
        if (err) {
            process.exit(5);
        }
        dataBase = mongoConnect.db("notesWebApp");
        app.listen(PORT);
        console.log(`Server started, port ${PORT}`);
    });
}

async function registerUser(params) {
  let email = params.email;
  let userName = params.username;
  let passWord = params.password;
  let existUser = await dataBase
    .collection("user")
    .find({ email: email })
    .toArray();
  if (existUser.length != 0) {
    return [`${email} has registered. Please use login!`, null];
  }

  let res = await dataBase
    .collection("user")
    .insertOne({
      email: email,
      userName: userName,
      password: passWord,
      sharedPage: [],
    });
  let Uid = await res.insertedId.toString();
  return [null, Uid];
}

async function postNote(title, content, author, noteId) {
  let newNoteId;
  if (noteId) {
    //update note: update note doesn't change the author
    await dataBase
      .collection("notes")
      .updateOne(
        { _id: new ObjectId(noteId) },
        { $set: { title: title, content: content, timeStamp: new Date() } }
      );
    newNoteId = noteId;
  } else {
    //create note: share group only contains author when create a new note
    let res = await dataBase
      .collection("notes")
      .insertOne({
        title: title,
        content: content,
        author: author,
        group: [],
        timeStamp: new Date(),
      });
    newNoteId = await res.insertedId.toString();
  }
  return newNoteId;
}

async function getNote(noteId) {
  if (noteId == "create") {
    return null;
  }
  let note = await dataBase
    .collection("notes")
    .find({ _id: new ObjectId(noteId) })
    .toArray();
  if (note.length === 0) {
    return null;
  }
  return note[0];
}

async function getUserByEmail(email) {
  let user = await dataBase.collection("user").find({ email: email }).toArray();
  if (user.length === 0) {
    return null;
  }
  return user[0];
}

async function updateNote(guestsInfo, noteId, sharedPageInfo, userId) {
  let updatedNote = await dataBase
    .collection("notes")
    .updateOne({ _id: new ObjectId(noteId) }, { $set: { group: guestsInfo } });
  let updatedUser = await dataBase
    .collection("user")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { sharedPage: sharedPageInfo } });
  if (updatedNote.modifiedCount === 1 && updatedUser.modifiedCount === 1) {
    let sharedUser = retriveGuestNames(guestsInfo)
    return [null, sharedUser];
  }
  errMessage = "Something went wrong. Please try again.";
  return [errMessage, null];
}

async function shareNote(noteId, guestEmail, mode) {
  let note = await getNote(noteId);
  let errMessage = null;
  let sharedUser = null;
  if (!note) {
    errMessage = "Note does not exist";
    return [errMessage, null];
  }
  if (note.group.length === 5) {
    errMessage = "Share number exceeds maximum of 5.";
    return [errMessage, null];
  }
  let guest = await getUserByEmail(guestEmail);
  if (!guest) {
    errMessage = "Guest does not exist.";
    return [errMessage, null];
  }
  if (note.author === guest._id.toString()) {
    errMessage = "Can't invite yourself.";
    return [errMessage, null];
  }
  for (let idx=0; idx < note.group.length; idx++) {
    let curGuest = note.group[idx];
    if (curGuest._id===guest._id.toString()) {
      if (curGuest.mode===mode) {
        errMessage = `Guest has already been invited to ${mode}.`;
        return [errMessage, null];
      }
      else {
        note.group[idx].mode = mode;
        //Get shared Pages Of Guest, change guest shared page info
        for (let sId=0; sId < guest.sharedPage.length; sId++) {
          guest.sharedPage[sId].mode = mode;
        }
        let userId = guest._id.toString();
        [errMessage, sharedUser] = await updateNote(note.group, noteId, guest.sharedPage, userId);
        return [errMessage, sharedUser]
      }
    }
  }
  if (note.group.includes(guest._id.toString())) {
    // if 
    errMessage = "Guest has already been invited.";
    return [errMessage, null];
  } 

  let guestInfo = {
      "_id" : guest._id.toString(),
      "email" : guest.email,
      "userName" : guest.userName,
      "mode": mode
    }
  note.group.push(guestInfo);
  // if (!!!guest.sharedPage) guest.sharedPage = [];
  guest.sharedPage.push({"noteId":noteId, "mode":mode});
  let userId = guest._id.toString();
  [errMessage, sharedUser] = await updateNote(note.group, noteId, guest.sharedPage, userId);
  return [errMessage, sharedUser]
}

function retriveGuestNames(guests) {
  sharedViewers = "";
  sharedEditors = "";
  for (guestInfo of guests) {
    if (guestInfo.mode==="view") {
      sharedViewers += guestInfo.userName + " ";
    }
    else {
      sharedEditors += guestInfo.userName + " ";
    }
  }
  return sharedEditors + ";" + sharedViewers;
}

async function getUserNameById(userId) {
  let user = await dataBase
    .collection("user")
    .find({"_id" : new ObjectID(userId)})
    .toArray();
    if (user.length===0) {
      return null;
    }
    return user[0].userName;
}

async function deleteGuest(noteId, delGuestEmail) {
  let note = await getNote(noteId);
  let newGuests = [];
  let delGuestId = null;
  for (let guestItem of note.group) {
      if (guestItem.email === delGuestEmail) {
        delGuestId = guestItem._id;
        continue;
      }
      newGuests.push(guestItem);
  }
  let newGuestNames = retriveGuestNames(newGuests)
  let errMessage;
  if (newGuests.length === note.group.length) {
    errMessage = "Email haven't been invited."
    return [errMessage, null];
  }
  let guest = await dataBase
                    .collection("user")
                    .find({"_id":new ObjectID(delGuestId)}).toArray();
  if (guest.length===0) {
    errMessage = "Guest doesn't exist."
    return [errMessage, null];
  }
  guest = guest[0];
  let guestSharedPage = guest.sharedPage
  let newSharedPage = guestSharedPage.filter((item)=>{
    return item.noteId !== noteId;
  })
  let delGuestRes = await dataBase
                      .collection("notes")
                      .updateOne({"_id": new ObjectID(noteId)},
                        {$set:{"group":newGuests}});
  let delSPageRes = await dataBase
                      .collection("user")
                      .updateOne({"_id": new ObjectID(delGuestId)}, 
                        {$set:{"sharedPage":newSharedPage}});
  if (delSPageRes.modifiedCount === 1 && delGuestRes.modifiedCount===1){
    return [null, newGuestNames];
  }
  return ["Something unknown happens. Please try again.", null];

}

async function addTodoItem(userId, content, isCompleted) {
  let res = await dataBase
      .collection("todoLists")
      .insertOne({
        userId: userId,
        content: content,
        isCompleted: isCompleted
      })
      let Tid = await res.insertedId.toString();
      return Tid.toString();
}
async function updateTodoItem(_Tid, isCompleted) {
  let updateTodo = await dataBase
      .collection("todoLists")
      .updateOne({_id : new ObjectID(_Tid)}, 
      {$set:{isCompleted : isCompleted}})
  // if (updateTodo.modifiedCount !== 1) {
  //   throw new Error("Updata Todo List Failed")
  // }
}

async function getTodoList(userId){
  let todoList = await dataBase
      .collection("todoLists")
      .find({"userId":userId})
      .toArray()
  return todoList;
}

async function deleteTodoItem(_Tid) {
  let updateTodo = await dataBase
    .collection("todoLists")
    .deleteOne({"_id":new ObjectID(_Tid)});
  // if (updateTodo.deletedCount===0) {
  //   throw new Error("Failed to delete todoList Item.");
  // }
}

app.get("/api/ping", (req, res, next) => {
  res.writeHead(200);
  res.write("Hello from server!\n");
  res.end();
  next();
});



app.post("/api/login", async (req, res, next) => {
  // curl -X POST -H "Content-Type: application/json" -d '{"email":"123@gmail.com", "password":"123"}' http://localhost:3000/login
  // db.user.find({"email":"jiaqi@usc.edu"})
  try {
    let email = req.body.email;
    let passWord = req.body.password;
    let existUser = await getUserByEmail(email);
    if (!existUser) {
      res.writeHead(406);
      res.write("Account doesn't exists. Please register.");
      res.end();
      return next();
    }
    if (existUser.password !== passWord) {
      res.writeHead(400);
      res.write("Password is incorrect.");
      res.end();
    } else {
      const user = {
        id: existUser._id.toString(),
        name: existUser.userName,
        email: existUser.email,
      };
      res.writeHead(200);
      res.write(JSON.stringify(user));
      res.end();
    }
    next();
  } catch (err) {
    throw err;
  }
});

app.post("/api/register", (req, res, next) => {
  // curl -X POST -H "Content-Type: application/json" -d '{"email":"123@gmail.com","username":"jq", "password":"123"}' http://localhost:3000/register
  try {
    registerUser(req.body).then((ret) => {
      let message = ret[0];
      let Uid = ret[1];
      if (message) {
        res.writeHead(202);
        res.write("Register Failed. " + message + "\n");
        res.end();
      } else {
        const user = {
          id: Uid.toString(),
          name: req.body.username,
          email: req.body.email,
        };
        res.writeHead(200);
        res.write(JSON.stringify(user));
        res.end();
      }
      next();
    });
  } catch (err) {
    throw err;
  }
});

app.get("/api/notes/:userId", async (req, res, next) => {
  try {
    let notes = await dataBase
      .collection("notes")
      .find({ author: req.params.userId })
      .toArray();
    for (let _note of notes) {
      let newNoteGroup = [];
      for (let _noteGroupItem of _note.group) {
        newNoteGroup.push(_noteGroupItem.userName);
      }
      _note.group = newNoteGroup;
    }
    notes = JSON.stringify(notes);
    res.writeHead(200);
    res.write(notes);
    res.end();
  } catch (err) {
    throw err;
  }
});

app.get("/api/notes/:userId/shared", async (req, res, next) => {
  try {
    const user = await dataBase
      .collection("user")
      .findOne({ _id: new ObjectId(req.params.userId) });
    const sharedItems = user.sharedPage;
    let notes = [];
    if (!!sharedItems) {
      for (const sharedItem of sharedItems) {
        const _note = await getNote(sharedItem.noteId);
        // let newNoteGroup = [];
        // for (let _noteGroupItem of _note.group) {
        //     newNoteGroup.push(_noteGroupItem.userName);
        //   }
        let author = await getUserNameById(_note.author)
        _note.group = [author];
        notes.push(_note);
      }
    }
    notes = JSON.stringify(notes);
    res.writeHead(200);
    res.write(notes);
    res.end();
  } catch (err) {
    throw err;
  }
});

app.get("/api/note/:noteId", async (req, res, next) => {
  try {
    let note = await getNote(req.params.noteId);
    if (!note) {
      res.writeHead(202);
      res.write("Note doesn't exist.");
      res.end();
    } else {
      note = JSON.stringify(note);
      res.writeHead(200);
      res.write(note);
      res.end();
    }
    next();
  } catch (err) {
    throw err;
  }
});

// curl -X POST "http://localhost:8000/api/note/62739b3b44a5a324f4f68f6f"
app.post("/api/note/:noteId", async (req, res, next) => {
  try {
    let title = req.body.title;
    let content = req.body.content;
    let noteId = await postNote(title, content, null, req.params.noteId);
    res.writeHead(200);
    res.write(noteId);
    res.end();
    next();
  } catch (err) {
    throw err;
  }
});

// curl -X POST "http://localhost:8000/api/create"
app.post("/api/createNew", async (req, res, next) => {
  try {
    let author = req.body.author;
    let noteId = await postNote("", "", author, null);
    res.writeHead(200);
    res.write(noteId);
    res.end();
    next();
  } catch (err) {
    throw err;
  }
});

app.delete("/api/note/:noteId", async (req, res, next) => {
  try {
    let ret = await dataBase
      .collection("notes")
      .deleteOne({ _id: new ObjectId(req.params.noteId) });
    if (ret.deletedCount === 0) {
      res.writeHead(204);
    } else {
      res.writeHead(200);
    }
    res.end();
    next();
  } catch (err) {
    throw err;
  }
});

app.post("/api/invite/:noteId", async (req, res, next) => {
  try {
    let [errMessage, sharedUser] = await shareNote(
      req.params.noteId,
      req.body.guestEmail,
      req.body.mode
    );
    if (errMessage) {
      res.writeHead(202);
      res.write(errMessage);
      res.end();
      return next();
    }
    res.writeHead(200);
    res.write(sharedUser);
    res.end();
    return next();
  } catch (err) {
    throw err;
  }
});



app.get("/api/noteGuest/:noteId", async (req, res, next) => {
  try {
    let note = await getNote(req.params.noteId);
    if (!note) {
      res.writeHead(202);
      res.write("Note doesn't exist.");
      res.end();
    } else {
      let guestsName = []
      for (let guestInfo of note.group) {
        guestsName.push(guestInfo.userName);
      }
      let guestNames = retriveGuestNames(note.group);
      res.writeHead(200);
      res.write(guestNames);
      res.end();
    }
    next();
  } catch (err) {
    throw err;
  }
});

app.post("/api/deleteGuest/:noteId", async (req, res, next) => {
  try {
    let noteId = req.params.noteId;
    let delGuestEmail = req.body.delGuest;
    let [errMessage, newGuest] = await deleteGuest(noteId, delGuestEmail);
    if (errMessage) {
      res.writeHead(202);
      res.write(errMessage);
      res.end();
      return next()
    } else {
      res.writeHead(200);
      res.write(newGuest);
      res.end();
      return next()
    }
  } catch (err) {
    throw err;
  }
});

//add a new todo item
app.post("/api/todoList/:userId/create", async (req, res, next)=>{
  try {
    let content = req.body.content;
    let isCompleted = req.body.isComplete;
    let userId = req.params.userId;
    let Tid = await addTodoItem(userId, content, isCompleted);
    res.writeHead(200);
    res.write(Tid)
    res.end();
    next();
  } catch(err) {
    throw err
  }
})

app.post("/api/todoList/:todoItemId/update", async(req, res, next)=>{
  try {
    let _Tid = req.params.todoItemId;
    let isCompleted = req.body.isCompleted;
    await updateTodoItem(_Tid, isCompleted);
    let todoLists = await getTodoList(req.body.userId);
    res.writeHead(200);
    res.write(JSON.stringify(todoLists));
    res.end();
    next();
  } catch(err) {
    throw err
  }
})

app.get("/api/todoList/:userId", async(req, res, next)=>{
  try {
    let userId = req.params.userId;
    let todoLists = await getTodoList(userId);
    res.writeHead(200);
    res.write(JSON.stringify(todoLists));
    res.end()
    next();
  } catch(err) {
    throw err;
  }
})

app.delete("/api/todoList/:todoItemId", async (req, res, next)=>{
  try {
    let _Tid = req.params.todoItemId;
    await deleteTodoItem(_Tid);
    res.writeHead(200);
    res.end();
    next();
  } catch(err) {
    throw err;
  }
})