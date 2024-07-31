const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose"); 
const session =  require("express-session");
const cookie = require("cookie-parser");
const methodOverride = require('method-override');
const compression = require('compression');

dotenv.config();
const app = express();

mongoose
  .connect(process.env.URL_DATABASE)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(`${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookie());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(compression());

app.use("/img", express.static(`${__dirname}/public/img/`)); 
app.use("/videos", express.static(`${__dirname}/public/videos/`)); 
app.use("/styles", express.static(`${__dirname}/public/styles/`)); 
app.use("/scripts", express.static(`${__dirname}/public/scripts/`));

const frontRoutes = require("./routes/front");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const postsRoutes = require("./routes/post");
const errorRoutes = require("./routes/error");

// Send session variables to views
app.use((req, res, next) => {
  // https://expressjs.com/en/4x/api.html#res.locals
  res.locals.isConnected = req.session.isConnected || false;
  res.locals.userId = req.session.userId || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.isSuperAdmin = req.session.isSuperAdmin || false;
  res.locals.message = req.session.message || null;
  if (req.session.message) {
    delete req.session.message;
  }

  // if there are some errors - provide them with previously inputed data to the view
  // and delete them from session, cause we need to show it only once
  if (req.session.errors) {
    res.locals.errors = req.session.errors || null;
    delete req.session.errors;
  }
  if (req.session.formData) {
    res.locals.formData = req.session?.formData || null;
    delete req.session?.formData;
  }

  next();
});
app.use(frontRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(usersRoutes);
app.use(postsRoutes);
app.use(errorRoutes);

app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000, () => {
    console.log(`Site disponible à l'adresse suivante : http://${process.env.HOST}:${process.env.PORT ? process.env.PORT : 3000}`);
});
