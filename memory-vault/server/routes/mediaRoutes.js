const router = require("express").Router()
const {getMedia,addMedia} = require("../controllers/mediaController")
const auth = require("../middleware/authMiddleware")

router.get("/",auth,getMedia)
router.post("/",auth,addMedia)

module.exports = router