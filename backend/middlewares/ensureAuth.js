const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(req.headers)

  if (!authHeader)
    return res.status(401).json({ error: "Token não foi informado!" });

  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).json({ error: "Erro no token" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: "Token fora do padrão" });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });

    if (decoded.role === "user") {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para acessar esse conteúdo" });
    }

    req.userEmail = decoded.email;
    return next();
  });
};
