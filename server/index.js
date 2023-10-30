const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");
const User = require("./models/DBschema.js");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken");
const secretId = "DontTellAnyOne";
const cookieParser = require("cookie-parser");

const PostModal = require("./models/Post.js");
const multer = require("multer"); // for image saving
const ExactDate = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specifies the directory where files will be stored
  },
  filename: function (req, file, cb) {
    let newFileCreation =
      file.fieldname + "-" + ExactDate + path.extname(file.originalname);
    cb(
      null,
      // this file field we already assigned in the response
      newFileCreation
    );
  },
});

const uploadMiddleware = multer({ storage: storage });

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "dbPass"
  //your pass
);
mongoose.connection.on("connected", () => {
  console.log("database is connected");
});

app.post("/register", async (req, res) => {
  const { password, userName } = req.body;
  try {
    const userDoc = await User.create({
      username: userName,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  // const { password, userName } = req.body;

  // Authenticate User
  const userAuth = await User.findOne({ username: req.body.userName });
  const passwordOK = bcrypt.compareSync(req.body.password, userAuth.password);

  // giving Token/cookie if Authenticated
  if (passwordOK) {
    jwt.sign(
      { username: req.body.userName, id: userAuth._id },
      secretId,
      {},
      (error, token) => {
        if (error) throw error;
        res
          .cookie("token", token)
          .json({ id: userAuth._id, username: userAuth.username });
      }
    );
  } else {
    res.status(400).json("somthing went wrong");
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secretId, {}, (error, info) => {
    if (error) throw error;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secretId, {}, async (error, info) => {
    if (error) throw error;
    const postDoc = await PostModal.create({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      cover:
        req.file.fieldname +
        "-" +
        ExactDate +
        path.extname(req.file.originalname),
      author: info.id,
    });
    res.status(200).json(postDoc);
  });
  // saving to the database
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  const token = req.cookies.token;
  let newPath = false;
  const dateNew = Date.now();
  let newFile = "";
  const findContent = await PostModal.findById(req.body.id);
  const previousFile = path.join("uploads/" + findContent.cover);
  if (req.file) {
    fs.unlinkSync(previousFile);
    newPath = true;
    newFile =
      req.file.fieldname + "-" + dateNew + path.extname(req.file.originalname);
  }

  jwt.verify(token, secretId, {}, async (error, info) => {
    if (error) throw error;
    const isAuthor =
      JSON.stringify(findContent.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not Author");
    }

    const response = await findContent.updateOne({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      cover: newPath ? newFile : findContent.cover,
      author: info.id,
    });
    res.json({
      response,
      isChanged: newPath,
      sendedFile: req.file,
      newFile: newFile,
    });
  });
});

app.get("/post", async (req, res) => {
  const posts = await PostModal.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModal.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.listen(port);
