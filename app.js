const express = require('express');
const userRoutes = require("./routes/userRoutes");
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const config = require("./config.js");
const session = require('express-session');
const blueprintRoutes = require('./routes/blueprintRoutes');

const app = express();

const uri = config.mongoURI;

const port = 8000;
const host = 'localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');



mongoose.connect(uri, {})
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Server running at http://localhost:` + port);
        });
    })
    .catch(err => console.log(err.message));

    app.use(session({
      secret: "iajsdhvdbi",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongoUrl: uri}),
      cookie: {maxAge: 60 * 60 * 1000}

    }))
    app.get('/', (req, res) => {
  
      res.render('index', { id: req.session.user });
    });
app.use((req,res,next)=>{
  res.locals.user = req.session.user || null;
  next();
})
//defining routes
app.use("/users", userRoutes);
app.use("/blueprints", blueprintRoutes);

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