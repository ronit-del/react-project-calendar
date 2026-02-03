import './App.css'
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Auth/login/login';
import Signup from './pages/Auth/signup/signup';
import ForgotPassword from './pages/Auth/forgot-password/forgot-password';
import Home from './pages/components/home/home';
import ResetPassword from './pages/Auth/reset-password/reset-password';
import { ResetPasswordGuard } from './pages/Auth/reset-password/ResetPasswordGuard';
import Profile from './pages/components/profile/profile';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        <Route path='/reset-password' element={<ResetPasswordGuard><ResetPassword /></ResetPasswordGuard>}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App