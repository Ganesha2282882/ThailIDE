const express = require('express');

const app = express();

app.use(express.static(__dirname + "/Public"))
app.use("/comp", express.static(__dirname + "/IDE/Compiler"))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html')
 
});

app.listen(3000, () => {
  console.log('Radioactive Software THAIL IDE Server Booted');
});