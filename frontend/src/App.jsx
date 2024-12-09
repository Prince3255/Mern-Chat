import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './component/Navbar'
import { HomePage, ProfilePage, SettingPage, LogIn, SignUp } from './page/index'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme} className='max-h-fit'>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ?  <HomePage /> : <Navigate to='/login' />} />
        <Route path='/setting' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LogIn /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to='/' />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App