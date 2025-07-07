import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import MarkdownEditor from "../components/shared/MarkdownEditor.jsx";

export default function AddDeck() {
  useDocumentTitle('Ajouter un deck – FichesFlow')

  return (
    <Container
      maxWidth="lg"
      sx={{mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
    >
      <Box bgcolor="#fff" p={2} borderRadius={1} boxShadow={3} mt={4} width="100%">
        <MarkdownEditor />
      </Box>
    </Container>
  )
}
