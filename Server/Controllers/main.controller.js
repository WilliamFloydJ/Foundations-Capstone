const bcrypt = require("bcryptjs");

let loggedIn = false;

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
    if (loggedIn) {
      var options = {
        root: path.join(__dirname, "../Public/Directory/Login"),
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
        root: path.join(__dirname, "../Public/Directory/Login"),
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
      root: path.join(__dirname, "../Public"),
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
  Login: (req, res) => {
    const { password, email, fullName } = req.data;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let user = { hash, fullName, email };
  },
};
