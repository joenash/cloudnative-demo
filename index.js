const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
