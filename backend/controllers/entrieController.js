const express = require("express");
const datefns = require("date-fns");

const System = require("../models/System");
const Entrie = require("../models/Entrie");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

//Registrar uma entrada em um sistema
router.get("/:system", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const today = datefns.format(new Date(), "dd/MM/yyyy");
    const system = await System.findOne({ dns: req.params.system });

    if (!system) {
      return res.status(404).send({ error: "Not Found" });
    }

    const findEntry = await Entrie.findOne({ system, ip_user: ip });

    if (!findEntry) {
      await Entrie.create({
        system: system._id,
        ip_user: ip,
      });
    }

    if (findEntry) {
      const { entry } = await Entrie.findOne(
        { system: system._id, ip_user: ip },
        ["entry"]
      )
      .sort({ entry: "desc" })
      const entrieDateFormated = datefns.format(entry, "dd/MM/yyyy");

      if (!(entrieDateFormated === today)) {
        await Entrie.create({
          system: system._id,
          ip_user: ip,
        });
      }
    }
  } catch (err) {
    return res.status(400).send({ error: "Erro registar uma entrada " + err });
  }
});

router.get("/entries/:system", authMiddleware, async (req, res) => {

  const system = await System.findOne({ dns: req.params.system })

  if (!system) {
    return res.status(404).send({ error: "Not Found" });
  }

  const totalEntries = await Entrie.countDocuments({ system: system })

  return res.status(200).json({ totalEntries })
});

module.exports = (app) => app.use("/entry", router);
