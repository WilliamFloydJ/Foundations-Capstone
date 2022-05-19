const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
require("dotenv").config();
const path = require("path");

var Rollbar = require("rollbar");
const req = require("express/lib/request");
const session = require("express-session");
var rollbar = new Rollbar({
  accessToken: "6264237b5e0a4cdcace4911095f7eb63",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  User: (req, res) => {
    if (req.session?.user?.id) {
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

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    sequelize
      .query(`select email from users where email = '${email}'`)
      .then((dbRes1) => {
        if (Object.keys(dbRes1[0]).length === 0) {
          sequelize
            .query(
              `insert into users(fullname,email,password) values('${fullName}', '${email}', '${hash}'); select userID from users where email = '${email}'`
            )
            .then((dbRes2) => {
              req.session.user = {
                id: dbRes2[0][0].userid,
                fullName: fullName,
                email: email,
                hash: hash,
              };
              res.status(201).send({ message: "Account Created!", code: 200 });
            })
            .catch((err) => console.log(err));
        } else {
          res.status(200).send({
            message: "Account with the same Email already exists.",
            code: 400,
          });
        }
      })
      .catch((err) => console.log(err));
    console.log(req.session);
  },
  Login: (req, res) => {
    const { password, email } = req.body;
    sequelize
      .query(`select * from users where email = '${email}'`)
      .then((dbRes) => {
        if (Object.keys(dbRes[0]).length !== 0) {
          if (bcrypt.compareSync(password, dbRes[0][0].password)) {
            req.session.user = {
              id: dbRes[0][0].userid,
              fullName: dbRes[0][0].fullname,
              email: email,
              hash: dbRes[0][0].password,
            };
            res.status(200).send({ message: "Logging In", code: 200 });
          } else {
            res.status(200).send({
              message: "You provided an incorrect password.",
              code: 400,
            });
          }
        } else {
          res.status(200).send({
            message:
              "A user with that Email does not exist. If you have yet to create an account please do so on the panel to the left.",
            code: 400,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({
          message: "Query failed",
          code: 400,
        });
      });
  },
  Session: (req, res) => {
    res.status(200).send(req.session);
  },
};
