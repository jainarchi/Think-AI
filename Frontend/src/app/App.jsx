import { useEffect } from 'react'
import {router} from './app.routes'
import { RouterProvider } from 'react-router-dom'
import { useAuth } from '../features/auth/hook/useAuth'


const App = () => {
   const auth = useAuth()

   useEffect(() => {
      auth.handleGetMe()
   }, [])
   


  return (
    <>

    <RouterProvider router={router} />


    
    </>
  )
}

export default App
