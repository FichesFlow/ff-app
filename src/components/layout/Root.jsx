import {Outlet} from "react-router";
import Box from "@mui/material/Box";
import Header from "./Header.jsx";
import {Container} from "@mui/material";
import Footer from "./Footer.jsx";

export default function Root() {
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
      <Footer/>
    </Container>
  );
}