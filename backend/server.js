const express = require("express");
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const userRoute = require("./routes/user")
const noteRoute = require("./routes/note")
const todoListRoute = require("./routes/todoList")
const shareNoteRoute = require("./routes/sharenote")

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
app.use("/user", userRoute);
app.use("/note", noteRoute);
app.use("/todoList", todoListRoute)
app.use("/share", shareNoteRoute)

var uri = "mongodb://localhost:27017/notesWebApp";
const uri_docDB = 'mongodb://EE547:12345678@docdb-2022-05-07-23-01-41.cluster-c76bpesfobkc.us-west-2.docdb.amazonaws.com:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
const PORT = 8000;

mongoose.connect(uri).then((connect)=>{
  app.listen(PORT);
  console.log(`Server started, port ${PORT}`);
}).catch((err)=>{
  console.log(err);
})

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if (err) {
      console.log("User email has not been verified.")
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

function createToken(id) {
  return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET);
}


app.get("/ping", (req, res, next) => {
  res.writeHead(200);
  res.write("Hello from server!\n");
  res.end();
  next();
});
