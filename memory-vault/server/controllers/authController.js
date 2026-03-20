const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.login = async(req,res)=>{

 const {email,password}=req.body

 const user = await User.findOne({email})

 if(!user) return res.status(400).json("User not found")

 const valid = await bcrypt.compare(password,user.password)

 if(!valid) return res.status(400).json("Wrong password")

 const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

 res.json({token})
}