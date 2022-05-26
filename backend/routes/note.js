const Note = require("../modules/noteModule")
const User = require("../modules/userModule")
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router()


async function getNote(noteId) {
  let note = Note.findOne({ "_id": new ObjectId(noteId) });
  return note;
}

async function getUserNameById(userId) {
  let user = User.findOne({"_id":new ObjectId(userId)})
  return user.userName
}


async function postNote(title, content, author, noteId) {
  let newNoteId;
  if (noteId) {
    //update note: update note doesn't change the author
    let newNote = await Note.updateOne({"_id":new ObjectId(noteId)}, {
      title,
      content,
      timeStamp: new Date()
    });
    newNoteId = noteId;
  } else {
    //create note: share group only contains author when create a new note
    const newNote = new Note({
        title,
        content,
        author,
        group:[],
        timeStamp: new Date()
    })
    await newNote.save()
    newNoteId = newNote._id.toString();
  }
  return newNoteId;
}
  

// get all own notes 
router.get("/:userId", async (req, res, next) => {
try {
    let notes = await Note.find({"author":new ObjectId(req.params.userId)});
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
    next();
} catch (err) {
    throw err;
}
});

// get all shared notes
router.get("/:userId/shared", async (req, res, next) => {
    try {
      const user = await User.findOne({"_id": new ObjectId(req.params.userId)});
      const sharedItems = user.sharedPage;
      let notes = [];
      if (!!sharedItems) {
        for (const sharedItem of sharedItems) {
          const _note = await getNote(sharedItem.noteId);
          let author = await getUserNameById(_note.author)
          _note.group = [author];
          notes.push(_note);
        }
      }
      notes = JSON.stringify(notes);
      res.writeHead(200);
      res.write(notes);
      res.end();
      next();
    } catch (err) {
      throw err;
    }
  });
  
// create new notes
router.post("/createNew", async(req, res, next)=>{
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
})

// write notes, update notes.
router.post("/write/:noteId", async (req, res, next) => {
    try {
      const {title, content} = req.body;
      let noteId = await postNote(title, content, null, req.params.noteId);
      res.writeHead(200);
      res.write(noteId);
      res.end();
      next();
    } catch (err) {
      throw err;
    }
  });

// get single note
router.get("/view/:noteId", async (req, res, next) => {
  try {
    let note = await getNote(req.params.noteId)
    if (!note) {
      res.writeHead(202);
      res.write("Note doesn't exist.")
      res.end()
      return next()
    } else {
      note = JSON.stringify(note)
      res.writeHead(200)
      res.write(note)
      res.end()
    }
    next()
  } catch (err) {
    throw err;
  }
});

// delete single note
router.delete("/:noteId", async (req, res, next) => {
  try {
    let ret = await Note.deleteOne({ _id: new ObjectId(req.params.noteId) });
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



module.exports = router