const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const { Direct, User, Login } = require("./Controllers/main.controller");

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "6264237b5e0a4cdcace4911095f7eb63",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

app.get("/public/Directory/User", User);

app.use("/public", express.static(path.join(__dirname, "../Public")));
app.get("/", Direct);

app.post("/login", Login);

const port = process.env.PORT || 4005;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
