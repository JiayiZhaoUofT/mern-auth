const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: "true" })
  .then(() => console.log("Mongoose successfully connected"))
  .catch(err => console.log(err));
//add new schema to database
require("./models/User.js");

const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect to mongoDB

const users = require("./routes/api/users");

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

//Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server up and running on port ${port}!`));
