if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const uuid = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const logins = require("./services/pg_logins.dal");

global.DEBUG = true;

//----------------------------------------------------------------------------------------
