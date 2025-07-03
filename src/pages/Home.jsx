import React from 'react';
import {Box,} from '@mui/material';
import HeroSection from "../components/home/HeroSection.jsx";
import AccountPrompt from "../components/home/AccountPrompt.jsx";
import FichesPreviewGallery from "../components/home/FichesPreviewGallery.jsx";

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      width="1600px"
      gap={4}
      px={2}
      py={6}
    >
      <HeroSection/>

      <FichesPreviewGallery/>

      <AccountPrompt/>
    </Box>
  );
}
