const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerDocs = require("./swagger.json");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

require("./controllers/authController")(app);
require("./controllers/assessmentController")(app);
require("./controllers/assessController")(app);
require("./controllers/systemController")(app);
require("./controllers/userController")(app);
require("./controllers/entrieController")(app);

app.listen(3001, () => {
  console.log("Servidor iniciado!");
});
