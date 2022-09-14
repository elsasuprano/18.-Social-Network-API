const thoughtRoutes = require("./thoughtroutes")
const userRoutes = require("./userroutes")

const router = require("express").Router()
router.use('/thought', thoughtRoutes)
router.use('/user', userRoutes)

module.exports = router