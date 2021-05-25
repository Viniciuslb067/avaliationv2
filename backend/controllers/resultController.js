const express = require("express");

const Avaliation = require("../models/Avaliation");
const Result = require("../models/Result");

const router = express.Router();

router.get("/:system", async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        const user = await Result.findOne({ ip_user: ip })

        if (!user || user === null) {
            const avaliation = await Avaliation.find({ system: req.params.system }, ['_id']).exec()
                if (avaliation) {
                    const assessment = await Avaliation.find({ _id: avaliation }, ['question'])
                        return res.json([{ assess: false, assessment }])
                } else {
                    return res.json([{ assess: true }])
                }
            } else {
                return res.json([{ assess: true }])
        }

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Erro ao listar as avaliações" });
    }
});

router.get("/result/:avaliationId", async (req, res) => {
    try {
        const find = await Avaliation.findOne({ _id: req.params.avaliationId }).exec();

        if (find) {
            const findResult = Result.findOne({ avaliation: req.params.avaliationId }).exec();
            if (findResult) {
                const notes = [
                    await Result.countDocuments({ 'note': 1, 'avaliation': req.params.avaliationId }),
                    await Result.countDocuments({ 'note': 2, 'avaliation': req.params.avaliationId }),
                    await Result.countDocuments({ 'note': 3, 'avaliation': req.params.avaliationId }),
                    await Result.countDocuments({ 'note': 4, 'avaliation': req.params.avaliationId }),
                    await Result.countDocuments({ 'note': 5, 'avaliation': req.params.avaliationId }),
                ]
                const status = [
                    await Result.countDocuments({ 'status': "Enviado", 'avaliation': req.params.avaliationId }),
                    await Result.countDocuments({ 'status': "Ignorado", 'avaliation': req.params.avaliationId }),
                ]
                const data = await Avaliation.findOne({ _id: req.params.avaliationId }).exec();
                const comments = await Result.find({ avaliation: req.params.avaliationId }, ['comments', 'ip_user']).where('status').all(['Enviado'])

                res.json({ notes, status, data, comments })
            }
        }
    } catch (err) {
        return res.status(400).send({ error: "Erro ao listar os resultados" });
    }
})

router.post("/:avaliationId", async (req, res) => {
    try {
        const { avaliationId } = req.params

        const { note, comments } = req.body

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        if (!note) {
            return res.status(200).json({ status: 2, error: "Antes de Enviar avalie o sistema!" });
        } else {
            await Result.create({
                ip_user: ip,
                note,
                comments,
                status: "Enviado",
                avaliation: avaliationId,
            });

            return res.status(200).json({ status: 1, success: "Muito obrigado por responder a avaliação!" });
        }
    } catch (err) {
        return res.status(400).send({ error: "Erro ao avaliar" });
    }
});

router.post("/skip/:avaliationId", async (req, res) => {
    try {
        const { avaliationId } = req.params

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

        await Result.create({
            ip_user: ip,
            status: "Ignorado",
            avaliation: avaliationId,
        })


    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Erro ao pular avaliação" });   
    }
})

module.exports = (app) => app.use("/avaliate", router);
