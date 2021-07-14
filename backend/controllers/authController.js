const express = require("express");
const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");

const authConfig = require("../config/auth.json");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: "1d",
  });
}

router.get("/me/:token", async (req, res) => {
  var userEmail;

  jwt.verify(req.params.token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 2, error: "Token inválido" });
    }

    userEmail = decoded.email;
  });

  const user = await User.findOne({ email: `${userEmail}@inss.gov.br` });

  return res.status(200).json({ user });
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

  client.bind(username, password, async (err) => {
    if (err) {
      return res
        .status(200)
        .json({ status: 2, error: "Usuário ou senha incorreto" });
    }

    let search = function () {
      const items = [];
      return new Promise((resolve, reject) => {
        client.search("ou=INSS,dc=gov,dc=br", opts, (err, res) => {
          if (err) {
            return res.status(200).json({ status: 2, error: err });
          }
          res.on("searchEntry", async (entry) => {
            items.push(entry.object);
            var user = await User.findOne({ cpf: entry.object.cpf });
            if (!user) {
              await User.create({
                name: entry.object.givenName,
                email: entry.object.mail,
                cpf: entry.object.cpf,
              });
            }
          });
          res.on('error', function (err) {
            console.error('error: ' + err.message);
            reject( error )
          });
          res.on("end", function (result) {
            resolve(items);
          });
        });
      });
    };

    const userData = await search();

    console.log(userData);

    res.cookie("token", generateToken({ email }));
    res.status(200).json({
      name: userData[0].givenName,
      email: mail,
      status: 1,
      token: generateToken({ email: mail }),
    });
  });

  // if (await User.findOne({ email: `${email}@inss.gov.br`, access: "Bloqueado" })) {
  //   return res.status(200).json({ status: 2, error: "Acesso bloqueado, aguardando a aprovação" });
  // }
});

module.exports = (app) => app.use("/auth", router);
