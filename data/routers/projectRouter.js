const express = require("express");
const Project = require("../helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
    Project.get()
        .then(projects => res.status(200).json(projects))
        .catch(error => res.status(500).json(error));
});

router.get("/:id", validateId, (req, res) => {
    res.status(200).json(req.project);
});

router.post("/", validateProject, (req, res) => {
    Project.insert(req.projectInfo)
        .then(res.status(201).json(req.projectInfo))
        .catch(error => res.status(500).json(error));
});

router.put("/:id", validateId, validateProject, (req, res) => {
    Project.update(req.projectId, req.projectInfo)
        .then(res.status(202).json(req.projectInfo))
        .catch(error => res.status(500).json(error));
});

router.delete("/:id", validateId, (req, res) => {
    Project.remove(req.projectId)
        .then(
            res
                .status(204)
                .json({ message: `removed project id: ${req.projectId}` })
        )
        .catch(error => res.status(500).json(error));
});

// custom middleware
async function validateId(req, res, next) {
    try {
        const { id } = req.params;

        const project = await Project.get(id);

        if (project) {
            req.projectId = id;
            req.project = project;
            next();
        } else {
            res.status(400).json({ error: "invalid project id" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

async function validateProject(req, res, next) {
    try {
        const projectInfo = req.body;

        if (projectInfo.name && projectInfo.description) {
            req.projectInfo = projectInfo;
            next();
        } else {
            res.status(400).json({
                error: "please make sure name and description are sent"
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = router;
