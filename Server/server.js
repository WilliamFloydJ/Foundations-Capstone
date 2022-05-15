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
  })
);
app.use(cors());
app.use(express.json());

const {
  Direct,
  User,
  Create,
  Login,
} = require("./Controllers/main.controller.js");

app.use("/server", express.static(path.join(__dirname, "./")));

app.get("/public/Directory/User", User);

app.use("/public", express.static(path.join(__dirname, "../Public")));

app.get("/", Direct);

app.post("/createAccount", Create);

app.get("/login", Login);
const port = process.env.PORT || 4199;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
