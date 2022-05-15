require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const {
  Direct,
  User,
  Create,
  Login,
} = require("/server/Controllers/main.controller.js");

app.use("/server", express.static(path.join(__dirname, "../Server")));

app.get("/public/Directory/User", User);

app.use("/public", express.static(path.join(__dirname, "../Public")));

app.get("/", Direct);

app.post("/createAccount", Create);
app.get("/login", Login);
const port = process.env.PORT || 4199;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
