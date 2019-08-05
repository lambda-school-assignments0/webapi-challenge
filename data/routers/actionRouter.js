const express = require("express");
const Action = require("../helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
    Action.get()
        .then(actions => res.status(200).json(actions))
        .catch(error => res.status(500).json(error));
});

router.get("/:id", validateId, (req, res) => {
    res.status(200).json(req.action);
});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

// custom middleware
async function validateId(req, res, next) {
    try {
        const { id } = req.params;

        const action = await Action.get(id);

        if (action) {
            req.action = action;
            next();
        } else {
            res.status(400).json({ error: "invalid action id" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = router;
