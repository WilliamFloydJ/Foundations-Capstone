const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const { CONNECTION_STRING } = process.env;
require("dotenv").config();
const path = require("path");

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "6264237b5e0a4cdcace4911095f7eb63",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

let currentUser = { loggedIn: false, fullName: "", email: "" };
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  User: (req, res) => {
    if (currentUser.loggedIn) {
      var options = {
        root: path.join(__dirname, "../../Public/Directory/Login"),
      };

      var fileName = "User.html";
      res.sendFile(fileName, options, function (err) {
        if (err) {
          rollbar.critical("User Page will not load");
        } else {
          rollbar.info("user page loaded Successfully");
        }
      });
    } else {
      var options = {
        root: path.join(__dirname, "../../Public/Directory/Login"),
      };

      var fileName = "Login.html";
      res.sendFile(fileName, options, function (err) {
        if (err) {
          rollbar.critical("Login Page will not load");
        } else {
          rollbar.info("Login page loaded Successfully");
        }
      });
    }
  },
  Direct: (req, res) => {
    var options = {
      root: path.join(__dirname, "../../Public"),
    };

    var fileName = "index.html";
    res.sendFile(fileName, options, function (err) {
      if (err) {
        rollbar.critical("Home Page will not load");
      } else {
        rollbar.info("Home page loaded Successfully");
      }
    });
  },
  Create: (req, res) => {
    const { password, email, fullName } = req.body;
    console.log(req.data);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    sequelize
      .query(`select email from users where email = '${email}'`)
      .then((dbRes) => {
        if (Object.keys(dbRes[0]).length === 0) {
          sequelize
            .query(
              `insert into users(fullname,email,password) values('${fullName}', '${email}', '${hash}');`
            )
            .then((dbRes) => {
              currentUser.loggedIn = true;
              currentUser.email = email;
              currentUser.fullName = fullName;
              res.status(201).send("Account Created!");
            })
            .catch((err) => console.log(err));
        } else {
          res.status(200).send("Account with the same Email already exists.");
        }
      })
      .catch((err) => console.log(err));
  },
  Login: (req, res) => {},
};
