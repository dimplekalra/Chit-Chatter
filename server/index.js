const express = require("express"),
  mongoose = require("mongoose"),
  router = require("./router"),
  bodyParser = require("body-parser"),
  socketEvents = require("./socketeventts"),
  // cors = require("cors"),
  app = express();
// const corsoptions = (req, callback) => {
//   let corsoption = {
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: true,
//     credentials: true,
//   };
//   callback(null, corsoption);
// };

mongoose.connect("mongodb://localhost:27017/mongotube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("database connected");
});

const server = app.listen(5000, () => {
  console.log("listening at port 5000");
});
const io = require("socket.io").listen(server);

socketEvents(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(cors(corsoptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router(app);
