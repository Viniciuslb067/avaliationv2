const express = require("express");
const datefns = require("date-fns");
const authMiddleware = require("../middlewares/auth");
const ensureAuthMiddleware = require("../middlewares/ensureAuth");

const Assessment = require("../models/Assessment");

const router = express.Router();

//Listar todas as avaliações
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assessmentOn = await Assessment.find({})
      .sort({ createdAt: "desc" })
      .where("status")
      .all(["Ativada"]);
    const assessmentOff = await Assessment.find({})
      .sort({ createdAt: "desc" })
      .where("status")
      .all(["Desativada"]);
    const recentAssessment = await Assessment.find({})
      .sort({ createdAt: "desc" })
      .where("status")
      .all(["Ativada"])
      .limit(10);
    const totalAssessment = await Assessment.countDocuments();

    await Promise.all(
      assessmentOn.map(async (status) => {
        const data = status.end_date;
        const parsedDate = datefns.parseISO(data);
        const past = datefns.isAfter(parsedDate, new Date());
        const future = datefns.isBefore(parsedDate, new Date());

        if (past === false) {
          await Assessment.updateMany(
            { _id: status._id },
            { $set: { status: "Desativada" } }
          );
        }
        if (future === false) {
          await Assessment.updateMany(
            { _id: status._id },
            { $set: { status: "Ativada" } }
          );
        }
      })
    );

    return res.json({
      assessmentOn,
      assessmentOff,
      totalAssessment,
      recentAssessment,
    });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao listar as avaliações" });
  }
});

//Listar uma avaliação
router.get("/:assessmentId", authMiddleware, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    return res.json(assessment);
  } catch (err) {
    return res.status(400).send({ error: "Erro ao listar a avaliação" });
  }
});
//Criar uma avaliação
router.post("/", ensureAuthMiddleware, async (req, res) => {
  try {
    const { question, requester, start_date, end_date, system } = req.body;

    if (!question || !requester || !start_date || !end_date || !system) {
      return res.status(200).json({ error: "Preencha todos os campos!" });
    }

    if (
      await Assessment.findOne({ system: system })
        .where("status")
        .all("Ativada")
    ) {
      return res.status(200).json({
        error: "Já existe uma avaliação ativa para este sistema!",
      });
    } else {
      const assessment = await Assessment.create({ ...req.body });
      return res.status(200).json({
        success: "Avaliação criada com sucesso",
        assessment,
      });
    }
  } catch (err) {
    return res.status(400).send({ error: "Erro ao criar uma avaliação" });
  }
});
//Editar uma avaliação
router.put("/:assessmentId", ensureAuthMiddleware, async (req, res) => {
  try {
    const { question, requester, start_date, end_date } = req.body;

    if (!question || !requester || !start_date || !end_date) {
      return res.status(200).json({ error: "Preencha todos os campos" });
    }

    const assessment = await Assessment.findByIdAndUpdate(
      req.params.assessmentId,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      success: "Avaliação atualizada com sucesso",
      assessment,
    });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao atualizar uma avaliação" });
  }
});
//Deletar uma avaliação
router.delete("/:assessmentId", ensureAuthMiddleware, async (req, res) => {
  try {
    await Assessment.findByIdAndRemove(req.params.assessmentId);
    return res.status(200).json({ success: "Avaliação excluida com sucesso" });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao deletar uma avaliação" });
  }
});

module.exports = (app) => app.use("/assessment", router);
