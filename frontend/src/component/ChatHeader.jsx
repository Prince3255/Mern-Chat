import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { X } from 'lucide-react'

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore()
  const { onLineUser } = useAuthStore()

  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className="avatar">
                    <div className='size-10 rounded-full relative'>
                        <img src={selectedUser.profilePic || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360'} alt={selectedUser.fullName} />
                    </div>
                </div>

                <div>
                    <h3 className='font-medium'>{selectedUser.fullName}</h3>
                    <p className='text-sm text-base-content/70'>{onLineUser.includes(selectedUser._id) ? 'Online' : 'Offline'}</p>
                </div>
            </div>

            <button onClick={() => setSelectedUser(null)}>
                <X />
            </button>
        </div>
    </div>
  )
}

export default ChatHeader