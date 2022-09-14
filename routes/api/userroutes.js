const router = require("express").Router()
const {Thought, User} = require("../../models")

router.get("/", (req,res) => {
   User.find().then(userData => res.json(userData))
   .catch(err => {
       console.log(err)
       res.status(500).json(err)
   })
})

router.get("/:userId", (req,res) => {
    User.findOne({_id: req.params.userId}).populate("friends").populate("thoughts").then(userData => {
        if (!userData){
            return res.status(404).json({message: "Could not find a user with that ID"})
        }
        res.json(userData)
    }).catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
 })

 router.post("/", (req,res) => {
    User.create(req.body).then(userData => {
        res.json(userData)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
 })

 router.put("/:userId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body},
        { runValidators: true, new: true }
    ).then(userData => {
        if (!userData) {
            return res.status(404).json({ message: "no user with that ID" })
        }
        res.json(userData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post("/:userId/friends/:friendId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId}},
        { new: true }
    ).then(userData => {
        if (!userData) {
            return res.status(404).json({ message: "no user with that ID" })
        }
        res.json(userData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.delete("/:userId/friends/:friendId", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId}},
        { new: true }
    ).then(userData => {
        if (!userData) {
            return res.status(404).json({ message: "no user with that ID" })
        }
        res.json(userData)
    })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

 module.exports = router