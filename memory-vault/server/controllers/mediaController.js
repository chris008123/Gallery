const Media = require("../models/Media")

exports.getMedia = async(req,res)=>{
 const media = await Media.find().sort({createdAt:-1})
 res.json(media)
}

exports.addMedia = async(req,res)=>{

 const {url,type} = req.body

 const media = new Media({
  url,
  type,
  uploader:req.user.id
 })

 await media.save()

 res.json(media)
}