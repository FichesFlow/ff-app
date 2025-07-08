import {useState} from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import MarkdownEditor from '../components/shared/MarkdownEditor.jsx'
import DeckInfos from "../components/deck/DeckInfos.jsx";

export default function AddDeck() {
  useDocumentTitle('Ajouter un deck – FichesFlow')

  const [language, setLanguage] = useState('fr')
  const [visibility, setVisibility] = useState('private')
  const [status, setStatus] = useState('draft')

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
      <DeckInfos
        language={language}
        setLanguage={setLanguage}
        visibility={visibility}
        setVisibility={setVisibility}
        status={status}
        setStatus={setStatus}
      />
      <Box bgcolor="#fff" p={2} borderRadius={1} boxShadow={3}>
        <MarkdownEditor/>
      </Box>
    </Container>
  )
}
