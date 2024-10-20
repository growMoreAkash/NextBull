
import config from '../config.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'


export const decodeUserJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const decode = jwt.verify(token, config.JWT_SECRET)
        if (!decode) return res.status(404).send("Error while decoding the token")
        console.log(decode)
        req.decode = decode

        //if not activate==> show error
        // const { userId, adminId } = decode;
        const {userId} = decode

        // if (!adminId) {
            const oldUser = await User.findOne({ _id: userId })
            if (!oldUser) return res.status(404).send("User not found")
            if (oldUser.activate == false) return res.status(404).send("You can't use any API")
            if (oldUser.otpVerified == false) return res.status(404).send("Verify your phone number")
        // }
        // if (!userId) {
        //     console.log(adminId)
        //     const oldAdmin = await Admin.findOne({ adminId })
        //     if (!oldAdmin) return res.status(404).send("Admin not found")
        //     if (oldAdmin.otpVerified == false) return res.status(404).send("Verify your phone number")
        // }

        next()

    } catch (error) {
        return res.status(404).send("Error " + error)
    }
}


export const adminAuth = async (req, res, next) => {
    try {
        const { adminId } = req.decode;
        const oldAdmin = await Admin.findOne({ adminId })
        if (oldAdmin.level !== "ADM") return res.status(404).send("U can't use the API")
        else {
            next()
        }
    } catch (error) {
        return res.status(404).send({error})
    }
}
