import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/user.models.js"
import nodemailer from "nodemailer"
import transporter from "../config/nodemailer.js"
import userAuth from "../middlewares/userAuth.middlewares.js"

export async function register(req, res) {
    const {name, email, password} = req.body
    if (!name || !email || !password) {
        return res.json({success: false, message: "All fields are required"})
    }
    try {  
        const exisitingUser = await userModel.findOne({email})
        if (exisitingUser) {
            return res.json({success: false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({name, email, password: hashedPassword})
        await user.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to our app",
            text: `Hi ${name}, welcome to our app.`
        }
        await transporter.sendMail(mailOptions)

        return res.json({success: true, message: "User registered successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.json({success: false, message: "All fields are required"})
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: "Invalid email"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: "Invalid password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success: true, message: "User logged in successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }   
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "Production",
            sameSite: process.env.NODE_ENV === "Production" ? "none" : "strict"
        })
        return res.json({success: true, message: "User logged out successfully"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//Send verification otp to user email
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body
        // const {userId} = req.body.userId || req.userId;
        const user = await userModel.findById(userId)
        if (user.isAccountVerified) {
            return res.json({success: false, message: "User is already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Verification code",
            text: `Your verification code is ${otp}. Verify your account using this OTP.`
        }
        await transporter.sendMail(mailOptions)
         return res.json({success: true, message: "Verification code sent successfully"})

    } catch (error) {
         return res.json({success: false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body
    if (!userId || !otp) {
        return res.json({success:false, message: "All fields are required"})
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        if (user.verifyOtp === "" || user.verifyOtp !== otp ) {
            return res.json({success: false, message: "Invalid OTP"})
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired"})
        }

        user.isAccountVerified = true
        user.verifyOtp = ""
        user.verifyOtpExpireAt = 0
        await user.save()
        return res.json({success: true, message: "User verified successfully"})

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true, message: "User is authenticated"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Send password reset otp
export const sendResetOtp = async (req, res) => {
    const {email} = req.body
    if (!email) {
        return res.json({success: false, message: "Email is required"})
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password reset code",
            text: `Your password reset code is ${otp}. Reset your password using this OTP.`
        }
        await transporter.sendMail(mailOptions)
        return res.json({success: true, message: "Password reset code sent successfully"})
    }
    catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//Reset User Password
export const resetPassword = async (req, res) => {
    const {email ,otp, newPassword} = req.body
    if (!email || !otp || !newPassword) {
        return res.json({success: false, message: "All fields are required"})
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success: false, message: "User not found"})
        }
        if (user.resetOtp === "" || user.resetOtp !== otp ) {
            return res.json({success: false, message: "Invalid OTP"})
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ""
        user.resetOtpExpireAt = 0
        await user.save()
        return res.json({success: true, message: "Password reset successfully"})
     }
     catch (error) {
        return res.json({success: false, message: error.message})
    }
}