import React, { useEffect, useRef } from 'react'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useChatStore } from '../store/useChatStore'
import MessageSkeleton from './skeleton/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/util'

function ChatContainer() {
  const { message, isMessageLoading, selectedUser, getMessage, subscribeToMessage, unsubscribeFrommessage } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessage(selectedUser._id)

    subscribeToMessage()

    return () => unsubscribeFrommessage()
  }, [getMessage, selectedUser._id, subscribeToMessage, unsubscribeFrommessage])

  useEffect(() => {
    if(messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behaviour: 'smooth' })
    }
  }, [message])

  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {
          message.map((message) => (
            <div key={message._id} className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`} ref={messageEndRef}>
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img src={message.senderId === authUser._id ? authUser.profilePic || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360' : selectedUser.profilePic || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360'} alt="Profile Pic" />
                </div>
              </div>
              <div className='chat-header mb-1'>
                <time className='text-xs opacity-50 ml-1'>
                  {
                    formatMessageTime(message.createdAt)
                  }
                </time>
              </div>
              <div className='chat-bubble flex flex-col'>
                  {
                    message.img && (
                      <img src={message.img} alt="Attachement" className='sm:max-w-[200px] rounded-md mb-2' />
                    )
                  }
                  {
                    message.message && <p>{message.message}</p>
                  }
              </div>
            </div>
          ))
        }
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer