"use strict";

const express = require(`express`),
fs = require(`fs`),
app = express();
app.use(function(req, res, next)
{
  res.header("Content-Type: application/xhtml+xml; charset=utf-8"),

  res.header("Strict-Transport-Security: max-age=31536000"),

  res.header("Content-Security-Policy: upgrade-insecure-requests");

  // temp fix, set the proper `accept` file types, and change per file being sent
  next();
});

app.use(express.static(__dirname + "/Public", {index: `index.xhtml`}))
app.use("/comp", express.static(__dirname + "/IDE/Compiler"));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.xhtml')
 
});

app.listen(3000, () => {
  console.log('Radioactive Software THAIL IDE Server Booted');
});