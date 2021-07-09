const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(req.headers)

  if (!authHeader)
    return res
      .status(401)
      .json({ status: 2, error: "Token não foi informado!" });

  jwt.verify(authHeader, authConfig.secret, (err, decoded) => {
    if (err)
      return res.status(401).json({ status: 2, error: "Token inválido" });

    req.userId = decoded.id;
    return next();
  });
};
