const express = require('express');
const userRoutes = require("./routes/userRoutes");
const mongoose = require('mongoose');
const config = require("./config.js");

const app = express();

const uri = config.mongoURI;

const port = 8000;
const host = 'localhost';

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

mongoose.connect(uri, {})
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://localhost:` + port);
        });
    })
    .catch(err => console.log(err.message));



//defining routes
app.use("/users", userRoutes);

app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});