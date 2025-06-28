import {RouterProvider} from "react-router";
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {router} from './routes.js'
import {AuthProvider} from "./context/AuthContext.jsx";
import {ThemeProvider} from "@mui/material/styles";
import {appTheme} from "./theme.js";
import CssBaseline from "@mui/material/CssBaseline";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={appTheme} defaultMode={"system"}>
        <CssBaseline />
        <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
