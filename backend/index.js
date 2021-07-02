const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("./controllers/authController")(app);
require("./controllers/avaliationController")(app);
require("./controllers/assessController")(app);
require("./controllers/systemController")(app);
require("./controllers/userController")(app);

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  ).listen(3001, () => {
    console.log("Servidor iniciado!");
  });