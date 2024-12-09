import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
    
        const user = await User.findById(decoded.userId).select("-password")
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
    
        req.user = user
        console.log(req.user)
        next()
    } catch (error) {
        console.log("Error in authenticate middleware: ", error.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}