const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");

const authConfig = require("../config/auth.json");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.get("/check", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    res.json({ status: 401, error: "Token inexistente" });
  } else {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 2, error: "Token inválido" });
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
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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

  if (await User.findOne({ email: email, access: "Pendente" })) {
    return res.status(200).json({
      status: 2,
      error: "O seu login está pendente, aguardando aprovação",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!email || !password) {
    return res
      .status(200)
      .json({ status: 2, error: "Preencha todos os campos" });
  }

  if (!user)
    return res.status(200).json({ status: 2, error: "Usuário não encontrado" });

  if (!(await bcrypt.compare(password, user.password)))
    return res
      .status(200)
      .json({ status: 2, error: "Usuário ou senha incorreto" });

  user.password = undefined;
  user.createdAt = undefined;

  res.cookie("token", generateToken({ id: user.id }), { httpOnly: true });
  res.status(200).json({
    name: user.name,
    status: 1,
    auth: true,
    token: generateToken({ id: user.id }),
  });
});

module.exports = (app) => app.use("/auth", router);
