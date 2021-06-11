const express = require("express");
const bcrypt = require("bcryptjs");
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

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const nameRegexp = /^([a-zA-Z ]){2,30}$/;

    if (!nameRegexp.test(name)) {
      return res.status(200).json({ status: 2, error: "Nome inválido" });
    }

    if (!emailRegexp.test(email)) {
      return res.status(200).json({ status: 2, error: "Email inválido" });
    }

    if (!name || !email || !password || !password2) {
      return res
        .status(200)
        .json({ status: 2, error: "Preencha todos os campos" });
    }

    if (name.length <= 3) {
      return res
        .status(200)
        .json({ status: 2, error: "O nome tem que possuir +3 caracteres " });
    }

    if (password !== password2) {
      return res
        .status(200)
        .json({ status: 2, error: "As senhas não coincidem!" });
    }

    if (password.length < 4) {
      return res
        .status(200)
        .json({ status: 2, error: "A senha tem que possuir +4 caracteres" });
    }

    if (await User.findOne({ email: email })) {
      return res.status(200).json({ status: 2, error: "Email já cadastrado" });
    } else {
      const user = await User.create(req.body);
      
      user.password = undefined;

      return res
        .status(200)
        .json({ status: 1, success: "Usuário cadastrado com sucesso!" });
    }
  } catch (err) {
    return res.status(400).send({ error: "Erro ao registrar" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  
  const username = `uid=${email},ou=01.111.1.CGIN,ou=01.111.DTI,ou=01.001.PRES,ou=INSS,dc=gov,dc=br`

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

  var client = ldap.createClient({
    url: "ldap://cnsldapdf.prevnet",
  });

  await client.bind(username, password, (err) => {
    if (err) {
      return res.status(200).json({ status: 2, error: "Usuário ou senha incorreto" });
    } else {
      client.search("ou=INSS,dc=gov,dc=br", opts, (err, res) => {
        if (err) {
          return res.status(200).json({ status: 2, error: err });
        }  else {
            res.on("searchEntry", (entry) => {
            console.log(entry.object.cpf, entry.object.givenName, entry.object.mail)
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
