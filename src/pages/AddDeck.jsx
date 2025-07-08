import {useRef, useState} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import MarkdownEditor from '../components/shared/MarkdownEditor.jsx'
import DeckInfos from '../components/deck/DeckInfos.jsx'
import OutlinedCard from '../components/flashcards/flashcard.jsx'

export default function AddDeck() {
  useDocumentTitle('Ajouter un deck – FichesFlow')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('fr')
  const [visibility, setVisibility] = useState('private')
  const [status, setStatus] = useState('draft')

  const markdownRef = useRef(null)
  const [cards, setCards] = useState([])
  const [editingId, setEditingId] = useState(null)

  /* create or update card */
  const handleSaveCard = () => {
    const md = markdownRef.current?.getMarkdown()
    if (!md || md.trim() === '') return

    if (editingId) {
      // update existing
      setCards((prev) => prev.map((c) => (c.id === editingId ? {...c, content: md} : c)))
      setEditingId(null)
    } else {
      // create new
      setCards((prev) => [...prev, {id: crypto.randomUUID(), content: md}])
    }
    markdownRef.current.setMarkdown('')
  }

  /* load card into editor for editing */
  const handleEditCard = (id) => {
    const card = cards.find((c) => c.id === id)
    if (!card) return
    markdownRef.current?.setMarkdown(card.content)
    setEditingId(id)
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

      <Button variant="contained" sx={{mt: 2, mb: 3}} onClick={handleSaveCard}>
        {editingId ? 'Mettre à jour la fiche' : 'Ajouter une fiche'}
      </Button>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.id}>
            <OutlinedCard
              sujet={titre || 'Titre de la fiche'}
              description_recto={card.content}
              description_verso="Description du verso de la fiche (optionnel)"
            />
            <Box mt={1} textAlign="center">
              <Button size="small" variant="outlined" onClick={() => handleEditCard(card.id)}>
                Modifier
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
