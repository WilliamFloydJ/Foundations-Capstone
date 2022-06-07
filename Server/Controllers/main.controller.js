const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
require("dotenv").config();
const path = require("path");

var Rollbar = require("rollbar");
const req = require("express/lib/request");
const res = require("express/lib/response");
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
  UserPage: (req, res) => {
    var options = {
      root: path.join(__dirname, "../../Public/Directory/Login"),
    };

    var fileName = "UserPage.html";
    res.sendFile(fileName, options, function (err) {
      if (err) {
        rollbar.critical("User Page will not load");
      } else {
        rollbar.info("user page loaded Successfully");
      }
    });
  },
  UserFind: (req, res) => {
    const userId = req.params.id;
    sequelize
      .query(`select * from users where userid = ${userId};`)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  Stories: (req, res) => {
    var options = {
      root: path.join(__dirname, "../../Public/Directory/Stories"),
    };

    var fileName = "Stories.html";
    res.sendFile(fileName, options, function (err) {
      if (err) {
        rollbar.critical("Story Page will not load");
      } else {
        rollbar.info("story page loaded Successfully");
      }
    });
  },

  StoriesAll: (req, res) => {
    sequelize
      .query(`select * from posts order by datetime DESC`)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  StoriesUser: (req, res) => {
    const filter = req.params.filter;
    sequelize
      .query(
        `select * from posts where userid = ${filter} order by datetime DESC`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  StoriesFilter: (req, res) => {
    const filter = req.params.filter;
    sequelize.query(`select * from posts order by ${filter};`).then((dbRes) => {
      res.status(200).send(dbRes[0]);
    });
  },
  StoryCreation: (req, res) => {
    const { userid, message } = req.body;
    const d = new Date();
    const dateString = `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    sequelize
      .query(
        `insert into posts (userid, message, datetime, likes) values (${userid}, '${message}' , '${dateString}', 0); select * from posts;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  StoryDelete: (req, res) => {
    const postId = req.params.postid;

    sequelize
      .query(
        `delete from comments where postid = ${postId};
        delete from post_like_user where postid = ${postId};
         delete from posts where postid = ${postId};`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  CommentDelete: (req, res) => {
    const commentId = req.params.commentid;

    sequelize
      .query(
        `delete from comments where commentid = ${commentId};
      `
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  CommentFind: (req, res) => {
    const postId = req.params.id;
    sequelize
      .query(`select * from comments where postid = ${postId};`)
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  CommentCreation: (req, res) => {
    const { userid, postid, message } = req.body;
    const d = new Date();
    const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    sequelize
      .query(
        `insert into comments (userid, postid, message, date) values (${userid}, ${postid} , '${message}' , '${dateString}'); select * from posts;`
      )
      .then((dbRes) => {
        res.status(200).send(dbRes[0]);
      });
  },
  PostHeartsAdd: (req, res) => {
    const paramsSplt = req.params.id.split("_");
    const postId = paramsSplt[0];
    const userId = paramsSplt[1];
    sequelize
      .query(
        `select * from post_like_user where postid = ${postId} and userid = ${userId};`
      )
      .then((dbRes) => {
        console.log(dbRes[0].length);
        if (dbRes[0].length === 0) {
          sequelize
            .query(`select likes from posts where postid = ${postId};`)
            .then((dbRes2) => {
              let hearts = dbRes2[0][0].likes;
              hearts++;
              sequelize
                .query(
                  `update posts set likes = ${hearts} where postid = ${postId}; insert into post_like_user (userid, postid) values (${userId}, ${postId}); select likes from posts where postid = ${postId};`
                )
                .then((dbRes3) => {
                  res.status(200).send(dbRes3[0]);
                });
            });
        }
      });
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
              let age = "";
              let background = "";
              let rank = "";
              sequelize
                .query(
                  `select age, background, rank from users where userid = ${dbRes2[0][0].userid}`
                )
                .then((dbRes3) => {
                  req.session.user = {
                    id: dbRes2[0][0].userid,
                    fullName: fullName,
                    email: email,
                    hash: hash,
                    age: age,
                    background: background,
                    rank: rank,
                  };
                  res.status(200).send(req.session.user);
                });
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
            let age = "";
            let background = "";
            let rank = "";
            sequelize
              .query(
                `select age, background, rank from users where userid = ${dbRes[0][0].userid}`
              )
              .then((dbRes3) => {
                age = dbRes3[0][0].age;
                background = dbRes3[0][0].background;
                rank = dbRes3[0][0].rank;

                req.session.user = {
                  id: dbRes[0][0].userid,
                  fullName: dbRes[0][0].fullname,
                  email: email,
                  hash: dbRes[0][0].password,
                  age: age,
                  background: background,
                  rank: rank,
                };
                res.status(200).send(req.session.user);
              });
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
  SessionPost: (req, res) => {
    if (req.body?.background) {
      req.session.user.background = req.body.background;
      sequelize.query(
        `update users set background = '${req.body.background}' where userid = ${req.session.user.id}; `
      );
    }

    if (req.body?.age) {
      req.session.user.age = req.body.age;
      sequelize.query(
        `update users set age = ${req.body.age} where userid = ${req.session.user.id}; `
      );
    }

    if (req.body?.rank) {
      req.session.user.rank = req.body.rank;
      sequelize.query(
        `update users set rank = '${req.body.rank}' where userid = ${req.session.user.id}; `
      );
    }

    res.status(200).send(req.session.user);
  },
};
