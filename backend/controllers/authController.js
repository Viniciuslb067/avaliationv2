const express = require("express");
const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");

const authConfig = require("../config/auth.json");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: "7d",
  });
}

router.get("/check", async (req, res) => {
  const token = req.query.token.split(" ")[1];
  if (!token) {
    res.json({ status: 301, error: "Token inexistente" });
  } else {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(301).json({ status: 2, error: "Token inválido" });
      } else {
        return res.json({ status: 200 });
      }
    });
  }
});

router.get("/logout", async (req, res) => {
  const token = req.headers.token;

  if (token) {
    res.cookie("token", null, { httpOnly: true });
  } else {
    res.status(401).send("Erro ao sair");
  }

  return res
    .status(200)
    .json({ status: 1, success: "Sessão finalizada com sucesso" });
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const username = `uid=${email}@inss.gov.br`;

  if (!email || !password) {
    return res
      .status(200)
      .json({ status: 2, error: "Preencha todos os campos" });
  }

  const [mail] = email.split(",", 1);
  const opts = {
    filter: `(uid=${mail})`,
    scope: "sub",
    attributes: ["cpf", "givenname", "mail"],
  };

  const client = ldap.createClient({
    url: "ldap://ldap.inss.gov.br",
  });

  client.bind(username, password, (err) => {
    if (err) {
      return res
        .status(200)
        .json({ status: 2, error: "Usuário ou senha incorreto" });
    } else {
      client.search("ou=INSS,dc=gov,dc=br", opts, (err, res) => {
        if (err) {
          return res.status(200).json({ status: 2, error: err });
        } else {
          res.on("searchEntry", async (entry) => {
            if (!(await User.findOne({ cpf: entry.object.cpf }))) {
              await User.create({
                name: entry.object.givenName,
                email: entry.object.mail,
                cpf: entry.object.cpf,
              });
            }
          });
        }
      });
    }

    res.cookie("token", generateToken({ email }), { httpOnly: true });
    res.status(200).json({
      email: mail,
      status: 1,
      auth: true,
      token: generateToken({ email: mail }),
    });
  });
});

module.exports = (app) => app.use("/auth", router);