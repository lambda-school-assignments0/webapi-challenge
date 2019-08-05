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

router.post("/", validateAction, (req, res) => {
    Action.insert(req.actionInfo)
        .then(res.status(201).json(req.actionInfo))
        .catch(error => res.status(500).json(error));
});

router.put("/:id", validateId, validateAction, (req, res) => {
    Action.update(req.actionId, req.actionInfo)
        .then(res.status(202).json(req.actionInfo))
        .catch(error => res.status(500).json(error));
});

router.delete("/:id", validateId, (req, res) => {
    Action.remove(req.actionId)
        .then(
            res
                .status(204)
                .json({ message: `removed action id: ${req.actionId}` })
        )
        .catch(error => res.status(500).json(error));
});

// custom middleware
async function validateId(req, res, next) {
    try {
        const { id } = req.params;

        const action = await Action.get(id);

        if (action) {
            req.actionId = id;
            req.action = action;
            next();
        } else {
            res.status(400).json({ error: "invalid action id" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

async function validateAction(req, res, next) {
    try {
        const actionInfo = req.body;

        if (
            actionInfo.project_id &&
            actionInfo.description &&
            actionInfo.notes
        ) {
            req.actionInfo = actionInfo;
            next();
        } else {
            res.status(400).json({
                error:
                    "please make sure project_id, description, and notes are sent"
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = router;
