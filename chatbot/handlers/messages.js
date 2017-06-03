"use strict";

const express = require('express');
const { Wit } = require("node-wit");
const witaiToken = process.env.WITAITOKEN;

if (!witaiToken) {
  console.error("please set WITAITTOKEN to your wit.ai app token");
  process.exit(1);
}

const witaiClient = new Wit({ accessToken: witaiToken });


module.exports = function(store) {
  let router = express.Router();
  
  router.post('/v1/bot', (req, res, next) => {
    try {
      let q = req.query.q;
      console.log(`user is asking ${q}`);
      witaiClient.message(q)
        .then(data => {
          res.send(JSON.stringify(data, undefined, 2))
        })
        .catch(next)
    } catch(err) {
      next(err);
    }
  })

  return router;
}