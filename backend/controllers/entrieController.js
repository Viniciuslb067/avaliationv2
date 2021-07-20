const express = require("express");
const datefns = require("date-fns");

const Assessment = require("../models/Assessment");
const Result = require("../models/Result");
const System = require("../models/System");
const Entrie = require("../models/Entrie");

const router = express.Router();

//Listar todos os sistemas
router.get("/:system", async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const today = datefns.format(new Date(), "dd/MM/yyyy");
    const system = await System.findOne({ dns: req.params.system });

    const findEntry = await Entrie.findOne({ system, ip_user: ip })

    if (!findEntry) {
      await Entrie.create({
        system: system._id,
        ip_user: ip,
      });
    } else {
      const entrieDate = await Entrie.findOne(
        { system: system._id, ip_user: ip },
        ["entry"]
      );
      
      const entrieDateFormated = "21/07/2021"

      if (!(today === entrieDateFormated)) {
        await Entrie.create({
          system: system._id,
          ip_user: ip,
        });
        if(findEntry && )
        console.log("IF")
      } else {
        console.log("CAIU NO ELSE");
      }
    }
  } catch (err) {
    return res.status(400).send({ error: "Erro ao listar os sistemas " + err });
  }
});

module.exports = (app) => app.use("/entry", router);
