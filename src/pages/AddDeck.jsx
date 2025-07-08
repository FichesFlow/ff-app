import {useRef, useState} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import MarkdownEditor from '../components/shared/MarkdownEditor.jsx'
import DeckInfos from '../components/deck/DeckInfos.jsx'
import OutlinedCard from "../components/flashcards/flashcard.jsx";

export default function AddDeck() {
  useDocumentTitle('Ajouter un deck – FichesFlow')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('fr')
  const [visibility, setVisibility] = useState('private')
  const [status, setStatus] = useState('draft')

  const markdownRef = useRef(null)
  const [cards, setCards] = useState([])

  const handleCreateCard = () => {
    const md = markdownRef.current?.getMarkdown()
    if (!md || md.trim() === '') return
    setCards((prev) => [...prev, {id: crypto.randomUUID(), content: md}])
    markdownRef.current.setMarkdown('')
  }

  return (
    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
      <DeckInfos
        titre={titre}
        setTitre={setTitre}
        description={description}
        setDescription={setDescription}
        language={language}
        setLanguage={setLanguage}
        visibility={visibility}
        setVisibility={setVisibility}
        status={status}
        setStatus={setStatus}
      />

      <Box bgcolor="#fff" p={2} borderRadius={1} boxShadow={3}>
        <MarkdownEditor ref={markdownRef}/>
      </Box>

      <Button
        variant="contained"
        sx={{mt: 2, mb: 3}}
        onClick={handleCreateCard}
      >
        Ajouter une fiche
      </Button>

      <Grid container direction="row" spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.id}>
            <OutlinedCard
              sujet={titre || 'Titre de la fiche'}
              // niveau="Niveau de difficulté"
              // theme="Thème de la fiche"
              description_recto={card.content}
              description_verso="Description du verso de la fiche (optionnel)"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
