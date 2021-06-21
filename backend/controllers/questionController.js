const express = require("express");

const Avaliation = require("../models/Avaliation");
const Question = require("../models/Question");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    
    await Question.create({ question: question });

    return res.status(200).json({
      status: 1,
      success: "Pergunta criada com sucesso",
    });

  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Erro ao criar uma avaliação" });
  }
});

module.exports = (app) => app.use("/questions", router);
