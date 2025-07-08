import {useRef, useState} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import MarkdownEditor from '../components/shared/MarkdownEditor.jsx'
import DeckInfos from '../components/deck/DeckInfos.jsx'
import OutlinedCard from '../components/flashcards/flashcard.jsx'
import {toast, ToastContainer} from 'react-toastify';
import {createDeck} from "../api/deck.js";
import {useNavigate} from 'react-router';
import useTheme from "../hooks/useTheme.js";

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentTheme = useTheme();
  const navigate = useNavigate();

  /* create or update card */
  const handleSaveCard = () => {
    const md = markdownRef.current?.getMarkdown()
    if (!md || md.trim() === '') return

    if (editingId) {
      setCards((prev) => prev.map((c) => (c.id === editingId ? {...c, content: md} : c)))
      setEditingId(null)
    } else {
      setCards((prev) => [...prev, {id: crypto.randomUUID(), content: md}])
    }
    markdownRef.current.setMarkdown('')
  }

  /* edit existing */
  const handleEditCard = (id) => {
    const card = cards.find((c) => c.id === id)
    if (!card) return
    markdownRef.current?.setMarkdown(card.content)
    setEditingId(id)
  }

  /* delete */
  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    if (editingId === id) {
      markdownRef.current?.setMarkdown('')
      setEditingId(null)
    }
  }

  /* send deck */
  const handleSubmitDeck = async () => {
    if (!titre.trim() || cards.length === 0) {
      alert('Titre et au moins une fiche sont requis')
      return
    }

    setIsSubmitting(true)

    const payload = {
      title: titre,
      description,
      language: language.toUpperCase(),
      visibility,
      status,
      cards: cards.map((c, index) => ({
        position: index,
        cardSides: [
          {
            side: 'front',
            cardBlock: {
              content: c.content
            }
          }
        ]
      }))
    }

    try {
      const res = await createDeck(JSON.stringify(payload))

      if (res && res.id) {
        toast.success('Deck créé avec succès !', {
          position: "bottom-right",
          theme: currentTheme === 'dark' ? 'dark' : 'light'
        });
        navigate('/')
      } else {
        toast.error('Erreur lors de la création du deck', {
          position: "bottom-right",
          theme: currentTheme === 'dark' ? 'dark' : 'light'
        });
      }
    } catch (e) {
      console.error(e)
      alert('Erreur réseau (mock)')
    } finally {
      setIsSubmitting(false)
    }
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

      <Stack direction="row" spacing={2} sx={{mt: 2, mb: 3}}>
        <Button variant="contained" onClick={handleSaveCard}>
          {editingId ? 'Mettre à jour la fiche' : 'Ajouter une fiche'}
        </Button>
        <Button variant="contained" onClick={handleSubmitDeck} color="secondary">
          Créer le deck
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.id}>
            <OutlinedCard
              sujet={titre || 'Titre de la fiche'}
              description_recto={card.content}
              description_verso="Description du verso de la fiche (optionnel)"
            />
            <Box mt={1} display="flex" gap={1} justifyContent="center">
              <Button size="small" variant="outlined" onClick={() => handleEditCard(card.id)}>
                Modifier
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDeleteCard(card.id)}
              >
                Supprimer
              </Button>
            </Box>
          </Grid>))}
      </Grid>
      <ToastContainer/>
    </Container>
  )
}
