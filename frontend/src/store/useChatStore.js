import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
    message: [],
    user: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUser: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get('/message/user')

            set({ user: res.data })
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message || error.message || "Something went wrong")
        } finally {
            set({ isUserLoading: false})
        }
    },

    getMessage: async (userId) => {
        set({ isMessageLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ message: res.data })
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message || error.message || "Something went wrong")
        } finally {
            set({ isMessageLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, message } = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ message: [...message, res.data]})
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message || error.message || "Something went wrong")
        }
    },

    subscribeToMessage: () => {
        const { selectedUser } = get()
        if (!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on('message1', (message1) => {
            const isMessageSentFromSelectedUser = message1.senderId === selectedUser._id

            if (!isMessageSentFromSelectedUser) return

            set({
                message: [...get().message, message1]
            })
        })
    },

    unsubscribeFrommessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off('message1')
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))