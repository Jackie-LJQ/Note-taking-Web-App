const express = require("express")
const router = express.Router()
const User = require("../modules/userModule")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")



router.post("/login", async (req, res, next) => {
  try {
    let {email, password} = req.body;
    console.log(req.body)
    let existUser = await User.findOne({"email":email});
    if (!existUser) {
      res.writeHead(406);
      res.write("Account doesn't exists. Please register.");
      res.end();
      return next();
    }
    console.log(existUser.password);
    const match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      res.writeHead(400);
      res.write("Password is incorrect.");
      res.end();
    } else {
      // const token = createToken(existUser._id.toString());
      //store access token in cookie
      // res.cookie('accessToken', token);
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


async function registerUser(req,res,next) {
  const {username, email, password} = req.body;
  const userExists = await User.exists({"email":email});
  if (userExists) {
    res.writeHead(202);
    res.write(`Register Failed. ${email} has registered. Please use login!`);
    res.end();
    return next('route');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email: email,
    userName: username,
    password: hashPassword,
    sharedPage: [],
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false
  });
  // const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN__SECRET); //, { expiresIn: '15s' });
  await newUser.save();
  req.user_id = newUser._id;
  next();
}


  
router.post("/register", registerUser, async (req, res, next) => {
  try {
    const user = {
      id: req.user_id.toString(),
      name: req.body.username,
      email: req.body.email,
    };
    res.writeHead(200);
    res.write(JSON.stringify(user));
    res.end();
    next();
  } catch (err) {
    throw err;
  }
});

module.exports = router
  