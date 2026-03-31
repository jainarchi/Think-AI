import {createBrowserRouter, Navigate} from 'react-router-dom'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Protected from '../features/auth/components/Protected'
import MainLayout from './layout/MainLayout'
import Dashboard from '../features/chat/pages/Dashboard'
import Discover from '../features/chat/pages/Discover'



export const router = createBrowserRouter([
   
   {
    path:"/login",
    element : <Login />
   },
   {
      path:"/register",
      element: <Register />
   },
   {
    path: "/",
    element: (
      <Protected>
        <MainLayout />
      </Protected>
    ),
    children: [
      {
        index: true, 
        element: <Dashboard />,
      },
      {
         path: "/discover",
         element: <Discover />
      }
   ]
   },
   {
      path: "*",
      element: < Navigate  to='/' replace/>
   }
  



])