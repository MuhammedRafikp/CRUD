import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/user/Home/Home'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/user/Login/Login'
import SignUp from './components/user/SignUp/SignUp'
import EditUser from './components/user/EditUser/EditUser'
import AdminLogin from './components/admin/Login/AdminLogin'
import AdminEditUser from './components/admin/EditUser/AdminEditUser'
import CreateUser from './components/admin/CreateUser/CreateUser'
import Dashboard from './components/admin/Dashboard/Dashboard'
import UserRouteProtector from './RouterProtectors/UserRouteProtector';
import UserLoginProtector from './RouterProtectors/UserLoginProtector';
import AdminRouteProtector from './RouterProtectors/adminRouteProtector';
import AdminLoginProtector from './RouterProtectors/adminLoginProtector';

const App = () => {
  return (
    <div>

      <ToastContainer theme='dark' />
      <Routes>

        <Route element={<UserLoginProtector />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Route>

        <Route element={<UserRouteProtector />}>
          <Route path='/' element={<Home />} />
          <Route path='/edit-user' element={<EditUser />} />
        </Route>

        {/* <Route path='/' element={<UserRouteProtector element={<Home />} />} />
        <Route path='/edit-user' element={<UserRouteProtector element={<EditUser />} />} /> */}

        <Route element={<AdminLoginProtector />}>
          <Route path='/admin/login' element={<AdminLogin />} />
        </Route>

        <Route element={<AdminRouteProtector />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/add-user' element={<CreateUser />} />
          <Route path='/admin/edit-user/:userId' element={<AdminEditUser />} />
        </Route>

      </Routes>

    </div>
  )
}

export default App
