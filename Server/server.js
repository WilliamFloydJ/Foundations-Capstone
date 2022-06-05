const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    },
    resave: false,
    saveUninitialized: true,
    rolling: true,
  })
);
app.use(cors());
app.use(express.json());

const {
  Direct,
  User,
  UserFind,
  Create,
  Login,
  Session,
  SessionPost,
  Stories,
  StoriesAll,
  StoryCreation,
  CommentFind,
  PostHeartsAdd,
  CommentCreation,
  StoriesFilter,
  StoriesUser,
  StoryDelete,
  CommentDelete,
} = require("./Controllers/main.controller.js");

app.use("/server", express.static(path.join(__dirname, "./")));

app.get("/User", User);

app.use("/public", express.static(path.join(__dirname, "../Public")));

app.get("/", Direct);

app.post("/createAccount", Create);

app.get("/server/session", Session);

app.post("/server/session/change", SessionPost);

app.post("/login", Login);

app.get("/Stories", Stories);

app.delete("/stories/delete/:postid", StoryDelete);

app.delete("/stories/comments/delete/:commentid", CommentDelete);

app.get("/stories/all", StoriesAll);

app.put("/stories/:filter", StoriesUser);

app.put("/stories/all/:filter", StoriesFilter);

app.post("/Stories/creation", StoryCreation);

app.put("/stories/comments/:id", CommentFind);

app.put("/stories/hearts/:id", PostHeartsAdd);

app.put("/users/:id", UserFind);

app.post("/stories/comment/creation", CommentCreation);

const port = process.env.PORT || 4199;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
