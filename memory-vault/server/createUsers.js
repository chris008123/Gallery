require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("./models/User")  // your User model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database connected"))
.catch(err => console.log(err))

// Function to create a user
const createUser = async (username, email, password) => {
  const existing = await User.findOne({ email })
  if (existing) {
    console.log(`${email} already exists`)
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = new User({
    username,
    email,
    password: hash
  })

  await user.save()
  console.log(`Created user: ${username}`)
}

// Add your two users here
const run = async () => {
  await createUser("Chris", "aidoochris0081@gmail.com", "Iloveu")
  await createUser("Bestie", "ernestinahaywood13@gmail.com", "Iloveu")
  mongoose.disconnect()
}

run()