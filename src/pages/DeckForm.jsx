import {useEffect, useRef, useState} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import MarkdownEditor from '../components/shared/MarkdownEditor.jsx'
import DeckInfos from '../components/deck/DeckInfos.jsx'
import OutlinedCard from '../components/flashcards/flashcard.jsx'
import {toast} from 'react-toastify';
import {createDeck, fetchDeck, updateDeck} from "../api/deck.js";
import {useNavigate, useParams} from 'react-router';
import CircularProgress from '@mui/material/CircularProgress';
import {importFileForCards} from "../api/import.js";
import {Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography} from '@mui/material';

export default function DeckForm() {
  const {id} = useParams();
  const isEditMode = !!id;

  useDocumentTitle(isEditMode ? 'Modifier un deck – FichesFlow' : 'Ajouter un deck – FichesFlow')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('fr')
  const [visibility, setVisibility] = useState('private')
  const [status, setStatus] = useState('draft')
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [user, setUser] = useState("");

  const markdownRef = useRef(null)
  const versoMarkdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const [cards, setCards] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [cardType, setCardType] = useState('single') // 'flashcard' or 'single'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  /* Fetch deck data when in edit mode */
  useEffect(() => {
    if (isEditMode) {
      const getDeck = async () => {
        try {
          setIsLoading(true);
          const deckData = await fetchDeck(id);

          setTitre(deckData.title || '');
          setDescription(deckData.description || '');
          setLanguage((deckData.language || 'FR').toLowerCase());
          setVisibility(deckData.visibility || 'private');
          setStatus(deckData.status || 'draft');

          const transformedCards = deckData.cards.map(card => {
            const frontSide = card.cardSides.find(side => side.side === "front");
            const backSide = card.cardSides.find(side => side.side === "back");
            const hasRecto = frontSide?.cardBlock?.content && frontSide.cardBlock.content.trim() !== '';
            return {
              id: crypto.randomUUID(),
              content_recto: frontSide?.cardBlock?.content || '',
              content_verso: backSide?.cardBlock?.content || '',
              cardType: hasRecto ? 'flashcard' : 'single',
              position: card.position
            };
          });

          transformedCards.sort((a, b) => a.position - b.position);
          setCards(transformedCards);
        } catch (error) {
          console.error("Failed to fetch deck:", error);
          toast.error('Impossible de charger le deck');
        } finally {
          setIsLoading(false);
        }
      };

      getDeck();
    }
  }, [id, isEditMode]);

  /* create or update card */
  const handleSaveCard = () => {
    const rectoMd = markdownRef.current?.getMarkdown() || ''
    const versoMd = versoMarkdownRef.current?.getMarkdown() || ''

    if (cardType === 'flashcard' && (!rectoMd.trim() || !versoMd.trim())) {
      toast.error('Veuillez remplir le recto et le verso pour une flashcard')
      return
    }

    if (cardType === 'single' && !rectoMd.trim()) {
      toast.error('Veuillez remplir le contenu de la fiche')
      return
    }

    console.log({rectoMd, versoMd, cardType})

    const cardData = {
      content_recto: rectoMd,
      content_verso: versoMd,
      cardType: cardType
    }

    if (editingId) {
      setCards((prev) => prev.map((c) => (c.id === editingId ? {...c, ...cardData} : c)))
      setEditingId(null)
    } else {
      setCards((prev) => [...prev, {id: crypto.randomUUID(), ...cardData}])
    }

    markdownRef.current?.setMarkdown('')
    versoMarkdownRef.current?.setMarkdown('')
  }

  /* edit existing */
  const handleEditCard = (id) => {
    const card = cards.find((c) => c.id === id)
    if (!card) return
    markdownRef.current?.setMarkdown(card.content_recto)
    versoMarkdownRef.current?.setMarkdown(card.content_verso)
    setCardType(card.cardType)
    setEditingId(id)
  }

  /* delete */
  const handleDeleteCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    if (editingId === id) {
      markdownRef.current?.setMarkdown('')
      versoMarkdownRef.current?.setMarkdown('')
      setEditingId(null)
    }
  }

  /* import file */
  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['txt', 'csv', 'md', 'json'];

    if (!allowedExtensions.includes(extension)) {
      toast.error('Format de fichier non supporté. Utilisez .txt, .csv, .md ou .json');
      return;
    }

    setIsImporting(true);

    try {
      const data = await importFileForCards(file);
      const {cards: importedCards, cardCount} = data;

      const transformedCards = importedCards.map((card, index) => {
        const getCardContent = () => {
          if (typeof card === 'object' && card?.front) {
            return {recto: card.front, verso: card.back || '', type: card.front ? 'flashcard' : 'single'};
          }
          if (typeof card === 'string') {
            return {recto: card, verso: '', type: 'single'};
          }
          return {recto: card.content || JSON.stringify(card), verso: '', type: 'single'};
        };

        const {recto, verso, type} = getCardContent();


        return {
          id: crypto.randomUUID(),
          content_recto: recto,
          content_verso: verso,
          cardType: type,
          position: cards.length + index
        };
      });

      setCards(prev => [...prev, ...transformedCards]);
      toast.success(`${cardCount} fiche(s) importée(s) avec succès !`);

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Échec de l\'importation du fichier. Veuillez réessayer.');
    } finally {
      setIsImporting(false);
    }
  };

  /* send deck */
  const handleSubmitDeck = async () => {
    if (!titre.trim() || cards.length === 0) {
      toast.error('Veuillez fournir un titre et au moins une fiche avant de soumettre le deck.')
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
        cardSides: c.cardType === 'flashcard'
          ? [
            {
              side: 'front',
              cardBlock: {
                content: c.content_recto
              }
            },
            {
              side: 'back',
              cardBlock: {
                content: c.content_verso
              }
            }
          ]
          : [
            {
              side: 'front',
              cardBlock: {
                content: c.content_recto
              }
            }
          ]
      }))
    }

    if (isEditMode) {
      payload.id = id
    }

    try {
      let response;

      if (isEditMode) {
        response = await updateDeck(id, JSON.stringify(payload));
        toast.success('Deck mis à jour avec succès !');
      } else {
        response = await createDeck(JSON.stringify(payload));
        toast.success('Deck créé avec succès !');
      }

      if (response && (response.id || id)) {
        navigate('/decks/' + (response.id || id));
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (e) {
      console.error(e)
      toast.error(`Échec de ${isEditMode ? 'la mise à jour' : 'la création'} du deck. Veuillez réessayer.`);
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg"
                 sx={{mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
        <CircularProgress/>
      </Container>
    );
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

      <Box bgcolor="#fff" p={3} borderRadius={1} boxShadow={3} mb={2}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Modifier la fiche' : 'Ajouter une fiche'}
        </Typography>

        <FormControl component="fieldset" sx={{mb: 3}}>
          <FormLabel component="legend">Type de fiche</FormLabel>
          <RadioGroup
            row
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <FormControlLabel
              value="single"
              control={<Radio/>}
              label="Fiche simple"
            />
            <FormControlLabel
              value="flashcard"
              control={<Radio/>}
              label="Flashcard (recto + verso)"
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 'medium'}}>
          Recto
        </Typography>
        <MarkdownEditor ref={markdownRef}/>

        {cardType === 'flashcard' && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 'medium'}}>
              Verso
            </Typography>
            <Box mb={2}>
              <MarkdownEditor ref={versoMarkdownRef}/>
            </Box>
            <Divider sx={{my: 2}}/>
          </>
        )}


      </Box>

      <Stack direction="row" spacing={2} sx={{mt: 2, mb: 3}}>
        <Button
          variant="contained"
          onClick={handleSaveCard}
          disabled={isSubmitting || isImporting}
        >
          {editingId ? 'Mettre à jour la fiche' : 'Ajouter une fiche'}
        </Button>

        {editingId && (
          <Button
            variant="outlined"
            onClick={() => {
              setEditingId(null)
              markdownRef.current?.setMarkdown('')
              versoMarkdownRef.current?.setMarkdown('')
              setCardType('single') // Reset to default when canceling edit
            }}
            disabled={isSubmitting || isImporting}
          >
            Annuler
          </Button>
        )}

        <Button
          variant="outlined"
          onClick={handleImportFile}
          disabled={isSubmitting || isImporting}
        >
          {isImporting ? 'Importation en cours...' : 'Importer un fichier'}
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmitDeck}
          color="secondary"
          disabled={isSubmitting || isImporting}
        >
          {isSubmitting ? 'Envoi en cours...' : isEditMode ? 'Mettre à jour le deck' : 'Créer le deck'}
        </Button>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.csv,.md,.json"
        onChange={handleFileSelect}
        style={{display: 'none'}}
      />

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item key={card.id}>
            <OutlinedCard
              sujet={titre || 'Titre de la fiche'}
              description_recto={card.content_recto}
              description_verso={card.content_verso || "Description du verso de la fiche (optionnel)"}
              nom={user.name}
              cardType={card.cardType}
            />
            <Box mt={1} display="flex" gap={1} justifyContent="center" flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEditCard(card.id)}
                disabled={isSubmitting}
              >
                Modifier
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDeleteCard(card.id)}
                disabled={isSubmitting}
              >
                Supprimer
              </Button>
            </Box>
          </Grid>))}
      </Grid>
    </Container>
  )
}
