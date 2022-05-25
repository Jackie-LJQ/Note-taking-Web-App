const Note = require("../modules/noteModule")
const User = require("../modules/userModule")
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router()


async function getNote(noteId) {
    let note = Note.findOne({ "_id": new ObjectId(noteId) });
    return note;
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


async function updateShare(guestsInfo, noteId, sharedPageInfo, userId) {
    let updatedNote = await Note.updateOne({ _id: new ObjectId(noteId) }, { group: guestsInfo});
    let updatedUser = await User.updateOne({ _id: new ObjectId(userId) }, { sharedPage: sharedPageInfo });
    if (updatedNote.modifiedCount === 1 && updatedUser.modifiedCount === 1) {
      let sharedUser = retriveGuestNames(guestsInfo)
      return sharedUser;
    }
    throw new Error("Something went wrong. Please try again.");
  }

// share note
router.post("/invite/:noteId", async (req, res, next) =>{
    const {guestEmail, mode} = req.body
    const noteId = req.params.noteId
    let note = await getNote(noteId);
    if (!note) {
      res.writeHead(202)
      res.write("Note does not exist")
      res.end()
      return next();
    }
    if (note.group.length === 5) {
      res.writeHead(202)
      res.write("Share number exceeds maximum of 5.")
      res.end()
      return next();
    }
    let guest = await User.findOne({"email":guestEmail});
    if (!guest) {
      res.writeHead(202)
      res.write("Guest does not exist.")
      res.end()
      return next()
    }
    if (note.author === guest._id.toString()) {
      res.writeHead(202)
      res.write("Can't invite yourself.")
      res.end()
      return next()
    }
    for (let idx=0; idx < note.group.length; idx++) {
      let curGuest = note.group[idx];
      if (curGuest._id===guest._id.toString()) {
        if (curGuest.mode===mode) {
          res.writeHead(202)
          res.write(`Guest has already been invited to ${mode}.`)
          res.end()
          return next()
        }
        else {
          note.group[idx].mode = mode;
          //Get shared Pages Of Guest, change guest's shared page info
          for (let sId=0; sId < guest.sharedPage.length; sId++) {
            guest.sharedPage[sId].mode = mode;
          }
          let userId = guest._id.toString();
          try {
            const sharedUser = await updateShare(note.group, noteId, guest.sharedPage, userId);
            res.writeHead(200)
            res.write(sharedUser)
            res.end()
            return next()
          }catch (err) {
            res.writeHead(202)
            res.write(err)
            res.end()
            return next()
          }
        }
      }
    }
    let guestInfo = {
        "_id" : guest._id.toString(),
        "email" : guest.email,
        "userName" : guest.userName,
        "mode": mode
      }
    note.group.push(guestInfo);
    guest.sharedPage.push({"noteId":noteId, "mode":mode});
    let userId = guest._id.toString();
    try {
        const sharedUser = await updateShare(note.group, noteId, guest.sharedPage, userId);
        res.writeHead(200)
        res.write(sharedUser)
        res.end()
        return next()
    }catch (err) {
        res.writeHead(202)
        res.write(err)
        res.end()
        return next()
    }
})

 

router.post("/deleteGuest/:noteId", async (req, res, next) => {
    try {
      let noteId = req.params.noteId;
      let delGuestEmail = req.body.delGuest;
      let note = await getNote(noteId);
      let delGuestId
      let newGuests = [];
      for (let guestItem of note.group) {
          if (guestItem.email === delGuestEmail) {
            delGuestId = guestItem._id;
            continue;
          }
          newGuests.push(guestItem);
      }
      let newGuestNames = retriveGuestNames(newGuests)
      if (newGuests.length === note.group.length) {
        res.writeHead(202);
        res.write("Email haven't been invited.");
        res.end();
        return next();
      }
      let guest = await User.findOne({"_id":new ObjectId(delGuestId)});
      if (!guest) {
        res.writeHead(202);
        res.write("Guest doesn't exist.");
        res.end();
        return next();
      }
      let guestSharedPage = guest.sharedPage
      let newSharedPage = guestSharedPage.filter((item)=>{
        return item.noteId !== noteId;
      })
      let delGuestRes = await Note.updateOne({"_id": new ObjectId(noteId)},
                            {"group":newGuests});
      let delSPageRes = await User.updateOne({"_id": new ObjectId(delGuestId)}, 
                            {"sharedPage":newSharedPage});
      if (delSPageRes.modifiedCount === 1 && delGuestRes.modifiedCount === 1){
        res.writeHead(200);
        res.write(newGuestNames);
        res.end();
        return next()
      }
        res.writeHead(202);
        res.write("Something unknown happens. Please try again.");
        res.end();
        return next()
    } catch (err) {
      throw err;
    }
  }); 

router.get("/showGuests/:noteId", async(req, res, next)=>{
  try {
    let note = await getNote(req.params.noteId);
    if (!note) {
      res.writeHead(202);
      res.write("Note doesn't exist.");
      res.end();
    } else {
      let guestNames = retriveGuestNames(note.group);
      res.writeHead(200);
      res.write(guestNames);
      res.end();
    }
    next();
  } catch (err) {
    throw err;
  }
})

module.exports = router
