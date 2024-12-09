import User from "../model/user.model.js"
import Message from "../model/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id

        const filterUser = await User.find({_id: {$ne: userId}}).select("-password")

        res.status(200).json(filterUser)
    } catch (error) {
        console.log("Error in getting user for sidebar", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params
        const userId = req.user._id

        const message = await Message.find({
            $or: [
                {
                    senderId: userId,
                    receiverId: receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: userId
                }
            ]
        })

        res.status(200).json(message)
    } catch (error) {
        console.log("Error in get message", error.message)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { message, img } = req.body
        const { id: receiverId } = req.params
        
        const userId = req.user._id

        let imageUrl
        if (img) {
            const uploadImg = await cloudinary.uploader.upload(img)
            imageUrl = uploadImg.secure_url
        }

        const message1 = new Message({
            senderId: userId,
            receiverId: receiverId,
            message,
            img: imageUrl
        })

        await message1.save()

        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message1", message1)
        }


        res.status(200).json(message1)
    } catch (error) {
        console.log("Error while sending message", error.message)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}