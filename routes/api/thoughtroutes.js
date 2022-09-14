const router = require("express").Router()
const { Thought, User } = require("../../models")

router.get("/", (req, res) => {
    Thought.find().then(thoughtData => res.json(thoughtData))
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get("/:thoughtId", (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId }).then(thoughtData => {
        if (!thoughtData) {
            return res.status(404).json({ message: "Could not find a thought with that ID" })
        }
        res.json(thoughtData)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.post("/", (req, res) => {
    Thought.create(req.body).then(thoughtData => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thoughtData._id } },
            { new: true }
        )
    }).then(userData => {
        if (!userData) {
            return res.status(404).json({ message: "Thought created but no user with this ID" })
        }
        res.json({ message: "thought was created" })
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})
router.put("/:thoughtId", (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true }).then(thoughtData => {
        if (!thoughtData) {
            return res.status(404).json({ message: "no thought with that ID" })
        }
        res.json(thoughtData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.delete("/:thoughtId", (req, res) => {
    Thought.findOneAndRemove({ _id: req.params.thoughtId }).then(thoughtData => {
        if (!thoughtData) {
            return res.status(404).json({ message: "no thought with that ID" })
        }
        return User.findByIdAndUpdate({ thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true })

    }).then(userData => {
        if (!userData) {
            return res.status(404).json({ message: "thought deleted but there is no user with that ID" })
        }
        res.json({ message: "Thought Deleted" })
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post("/:thoughtId/reactions", (req, res) => {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true }).then(thoughtData => {
        if (!thoughtData) {
            return res.status(404).json({ message: "no thought with that ID" })
        }
        res.json(thoughtData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
    ).then(thoughtData => {
        if (!thoughtData) {
            return res.status(404).json({ message: "no thought with that ID" })
        }
        res.json(thoughtData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

module.exports = router