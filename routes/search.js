const express = require("express");
const router = express.Router();
const searchesDal = require("../services/mongo.vehicles.dal");
const historyDal = require("../services/postgres.userHistory.dal");
//const searchesFromPostgressDal = require("../services/pg.vehicles.dal");

router.get("/", async (req, res) => {
  if (DEBUG) console.log("user: " + req.user.username + " used the search bar");
  res.render("search.ejs", {
    name: req.user.username,
    email: req.user.email,
    id: req.user._id,
  });
});

router.get("/results", async (req, res) => {
  if (DEBUG) console.log("keyword searched: " + req.query.search);
  if (DEBUG) console.log("database used: " + req.query.db);
  try {
    let theSearches = await searchesDal.getSearchedVehicles(req.query.search);
    if (DEBUG) console.table(theSearches);
    res.render("results", {
      theSearches,
      name: req.user.username,
      email: req.user.email,
      id: req.user._id,
      search: req.query.search,
    });

    historyDal.addHistoryLog(
      req.user._id,
      req.user.username,
      req.query.search,
      theSearches.length,
      req.query.db == "both" ? "mongo & postgres" : req.query.db
    );
  } catch {
    res.render("503");
  }
});

module.exports = router;
