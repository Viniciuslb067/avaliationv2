const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Assessment = require("../models/Assessment");
const Result = require("../models/Result");

const router = express.Router();

router.get("/:system", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const findOneAssess = await Assessment.findOne(
      { system: req.params.system },
      ["_id"]
    )
      .where("status")
      .all("Ativada");

    if (!findOneAssess) {
      return res.json([{ assess: true }]);
    } else {
      const verifyAlreadyAssess = await Result.findOne({
        ip_user: ip,
        assessment: findOneAssess,
      });

      if (!verifyAlreadyAssess) {
        const assessment = await Assessment.find({ _id: findOneAssess }, [
          "question",
        ])
          .sort({ createdAt: "desc" })
          .where("status")
          .all("Ativada")
          .limit(1);

        return res.json([{ assess: false, assessment }]);
      }
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao listar as avaliações" + err });
  }
});

router.get("/result/:assessId", authMiddleware, async (req, res) => {
  try {
    const find = await Assessment.findOne({
      _id: req.params.assessId,
    }).exec();

    if (find) {
      const findResult = await Result.findOne({
        assessment: req.params.assessId,
      }).exec();

      if (findResult) {
        const infoAssessment = await Assessment.findOne({
          _id: req.params.assessId,
        }).exec();

        const notes = [
          await Result.countDocuments({
            note: 1,
            assessment: req.params.assessId,
          }),
          await Result.countDocuments({
            note: 2,
            assessment: req.params.assessId,
          }),
          await Result.countDocuments({
            note: 3,
            assessment: req.params.assessId,
          }),
          await Result.countDocuments({
            note: 4,
            assessment: req.params.assessId,
          }),
          await Result.countDocuments({
            note: 5,
            assessment: req.params.assessId,
          }),
        ];

        const submissions = [
          await Result.countDocuments({
            status: "Enviado",
            assessment: req.params.assessId,
          }),
          await Result.countDocuments({
            status: "Ignorado",
            assessment: req.params.assessId,
          }),
        ];

        const media =
          (notes[0] * 1 +
            notes[1] * 2 +
            notes[2] * 3 +
            notes[3] * 4 +
            notes[4] * 5) /
          submissions[0];

        const mediaFormatted = media.toFixed(1);

        const comments = await Result.find(
          { assessment: req.params.assessId, comments: { $gt: "" } },
          ["comments", "ip_user", "createdAt", "note", "browser", "system"]
        )
          .where("status")
          .all(["Enviado"]);

        const totalComments = await Result.countDocuments({
          assessment: req.params.assessId,
          comments: { $gt: "" },
        });

        const browserName = await Result.find(
          { assessment: req.params.assessId },
          "browser"
        );

        const browserInfo = await Promise.all(
          browserName.map(async (browser) => {
            const total = await Result.countDocuments({
              browser: browser.browser,
            });

            return {
              browserName: browser.browser,
              total: total,
            };
          })
        );

        res.json({
          infoAssessment,
          notes,
          submissions,
          mediaFormatted,
          comments,
          totalComments,
          browserInfo,
        });
      }
    }
  } catch (err) {
    return res
      .status(400)
      .send({ error: "Erro ao listar os resultados: " + err });
  }
});

router.post("/:assessId", async (req, res) => {
  try {
    const { assessId } = req.params;

    const { note, comments, browser, system } = req.body;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if (!note) {
      return res
        .status(200)
        .json({ error: "Antes de enviar avalie o sistema!" });
    } else {
      await Result.create({
        ip_user: ip,
        browser,
        system,
        note,
        comments,
        status: "Enviado",
        assessment: assessId,
      });

      return res.status(200).json({
        success: "Muito obrigado por responder a avaliação!",
      });
    }
  } catch (err) {
    return res.status(400).send({ error: "Erro ao avaliar" + err });
  }
});

router.post("/skip/:assessId", async (req, res) => {
  try {
    const { assessId } = req.params;
    const { browser, system } = req.body;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    await Result.create({
      ip_user: ip,
      browser,
      system,
      status: "Ignorado",
      assessment: assessId,
    });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao pular avaliação: " + err });
  }
});

module.exports = (app) => app.use("/assess", router);
