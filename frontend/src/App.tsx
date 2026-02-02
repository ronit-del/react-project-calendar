import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/login/login';
import Signup from './pages/Auth/signup/signup';
import ForgotPassword from './pages/Auth/forgot-password/forgot-password';
import Home from './pages/components/home/home';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/forgot-password' element={<ForgotPassword />}></Route>
      <Route path='/home' element={<Home />}></Route>
    </Routes>
  )
}

export default App