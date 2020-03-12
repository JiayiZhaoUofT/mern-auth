//connect to mongoDB
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: "true" })
  .then(() => console.log("Mongoose successfully connected"))
  .catch(err => console.log(err));
//add new schema to database
require("./models/User.js");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const app = express();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
app.use(awsServerlessExpressMiddleware.eventContext());
app.get("/", (req, res) => {
  res.send(" hello world");
});
const users = require("./routes/api/users");
const images = require("./routes/api/images");
//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

//Routes
app.use("/users", users);
app.use("/users/user", (req, res) => res.send("oooo"));
app.use("/images", images);
module.exports = app;
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`server up and running on port ${port}!`));
