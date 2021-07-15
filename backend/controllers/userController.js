const express = require("express");
const authMiddleware = require("../middlewares/auth");
const ensureAuthMiddleware = require("../middlewares/ensureAuth");

const User = require("../models/User");

const router = express.Router();

//Listar todos os usuários
router.get("/", authMiddleware, async (req, res) => {
  const users = await User.find();
  const totalUser = await User.countDocuments();

  return res.json({ users, totalUser });
});
//Listar um usuário
router.get("/:userId", ensureAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.json(user);
  } catch (err) {
    return res.status(400).send({ error: "Erro ao listar um usuário" });
  }
});
//Editar um usuário
router.put("/:userId", ensureAuthMiddleware, async (req, res) => {
  try {
    const { name, role, access } = req.body;

    if (!name || !role) {
      return res
        .status(200)
        .json({ status: 2, error: "Preencha todos os campos" });
    }

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ status: 1, success: "Usuário atualizado com sucesso", user });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao atualizar um usuário" });
  }
});
//Deletar um usuário
router.delete("/:userId", ensureAuthMiddleware, async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.userId);

    return res
      .status(200)
      .json({ status: 1, success: "Usuário excluido com sucesso" });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao excluir um usuário" });
  }
});
module.exports = (app) => app.use("/user", router);
