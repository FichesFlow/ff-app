import {Outlet} from "react-router";
import Box from "@mui/material/Box";
import Header from "./Header.jsx";
import {Container} from "@mui/material";
import Footer from "./Footer.jsx";
import {ToastContainer} from 'react-toastify';
import useTheme from "../../hooks/useTheme.js";


export default function Root() {
  const currentTheme = useTheme();
  return (
    <Container sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header/>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flex={1}
        px={2}
      >
        <Outlet/>
      </Box>
      <ToastContainer
        position="bottom-right"
        role="alert"
        aria-live="polite"
        theme={currentTheme === 'dark' ? 'dark' : 'light'}/>
      <Footer/>
    </Container>
  );
}