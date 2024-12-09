import express from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { getUserForSidebar, getMessage, sendMessage } from '../controller/message.controller.js'

const router = express.Router()


router.get('/user', authenticate, getUserForSidebar)
router.get('/:id', authenticate, getMessage)

router.post('/send/:id', authenticate, sendMessage)

export default router