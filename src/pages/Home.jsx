import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import HeroSection from "../components/home/HeroSection.jsx";
import AccountPrompt from "../components/home/AccountPrompt.jsx";
import FichesPreviewGallery from "../components/home/FichesPreviewGallery.jsx";
import ProgressSection from "../components/home/ProgressSection.jsx";
import ContributionsSection from "../components/home/ContributionsSection.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import StatsLeaderboard from "../components/home/StatsLeaderboard.jsx";
import {useDocumentTitle} from "../hooks/useDocumentTitle.js";

export default function Home() {
  useDocumentTitle("FichesFlow – La plateforme de fiches de révision collaborative");

  const {isAuthenticated} = useAuth();

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
      {isAuthenticated ? (
        <Stack width="100%" spacing={3} alignItems="center">
          <StatsLeaderboard/>
          <ProgressSection/>
          <ContributionsSection/>
        </Stack>
      ) : (
        <HeroSection/>
      )}

      <FichesPreviewGallery/>

      {!isAuthenticated && (<AccountPrompt/>)}
    </Box>
  );
}
