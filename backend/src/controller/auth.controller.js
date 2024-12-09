import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import generateToken from '../lib/util.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;


    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters'
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }
        else {
            res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        console.log("Error i signup controller", error.message);
        return res.status(500).json({ message: 'Internal server error'})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
    
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        generateToken(user._id, res)
    
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login", error.message)
        res.status(500).json({ message: 'Internal server error'})   
    } 
}

export const logout = (req,res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Error in logout", error.message)
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        const uploadProfilePic = await cloudinary.uploader.upload(profilePic)

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    profilePic: uploadProfilePic.secure_url
                }
            },
            {
                new: true
            }
        )

        res.status(200).json(user)
    } catch (error) {
        console.log("Error in update Profile", error.message)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in check auth", error.message)
        res.status(500).json({ message: 'Internal server error' })
    }
}