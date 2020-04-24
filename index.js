"use strict";

const express = require(`express`),
fs = require(`fs`),
app = express();

app.use( async (req, res, next) =>
{
  console.log(`Someone requested the webpage from "${req.baseUrl}"`); // SF: How do I get this to work?

  res.header("Content-Type: application/xhtml+xml; charset=utf-8;"),

  res.header("Strict-Transport-Security: max-age=31536000;"),

  res.header("Content-Security-Policy: upgrade-insecure-requests;");

  // temp fix, set the proper `accept` file types, and change per file being sent
  next();
});

// SF: Is "__dirname" really necessary?

app.use(express.static(__dirname + "/Public", {index: `index.xhtml`}));

app.use("/comp", express.static(__dirname + "/IDE/Compiler"));


app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/Public/index.xhtml')
 
});

app.listen(3000, async () => {
  console.log('Radioactive Software THAIL IDE Server Booted');
});