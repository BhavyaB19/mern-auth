import express from 'express'
import userAuth from '../middlewares/userAuth.middlewares.js'
import { getUserData } from '../controllers/user.controllers.js'
 
const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData)

export default userRouter