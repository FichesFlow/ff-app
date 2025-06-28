import {RouterProvider} from "react-router";
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {router} from './routes.js'
import {AuthProvider} from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
