"use strict";

const express = require('express');
const {
  Wit
} = require("node-wit");
const handle = require("./intent.js")

//setup wit ai
const witaiToken = process.env.WITAITOKEN;
if (!witaiToken) {
  console.error("please set WITAITTOKEN to your wit.ai app token");
  process.exit(1);
}
const witaiClient = new Wit({
  accessToken: witaiToken
});

module.exports = function (store) {
  let router = express.Router();

  router.post('/v1/bot', (req, res, next) => {
    try {
      let q = req.query.q;
      let user = JSON.parse(req.header('X-User'));

      console.log(`user ${user.email} is asking ${q}`);

      witaiClient.message(q)
        .then(data => {
          res.setHeader("Content-Type", "text/plain");
          switch (data.entities.intent[0].value) {
            case "late-post":
              handle.lateMessage(res, data, store, user);
              break;
            case "count":
              handle.countMessages(res, data, store, user);
              break;
            case "most":
              handle.mostMessages(res, data, store, user);
              break;
            case "member":
              handle.memberMessages(res, data, store, user);
              break;
            default:
              res.send("Sorry, I'm not sure how to answer that. Please try again.");
          }
        })
        .catch(next);
    } catch (err) {
      next(err);
    }
  })

  return router;
}