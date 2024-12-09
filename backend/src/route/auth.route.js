import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controller/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const route = express.Router()


route.post('/signup', signup)

route.post('/login', login)

route.post('/logout', logout)

route.put('/update-profile', authenticate, updateProfile)

route.get('/check', authenticate, checkAuth)

export default route