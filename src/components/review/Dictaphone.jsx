import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Fonction pour continuer la reconnaissance vocale sans arrêt automatique
function SpeechContinue() {
  SpeechRecognition.startListening({ continuous: true, language: 'fr-FR', interimResults: true });
}

// Fonction pour comparer le texte de référence et le texte reconnu à améliorer 
function compareTexts(reference, spoken) {
  const refWords = reference.trim().toLowerCase().split(/\s+/);
  const spokenWords = spoken.trim().toLowerCase().split(/\s+/);
  
  let correct = 0;
  refWords.forEach((word, i) => {
    if (spokenWords[i] === word) {
      correct++;
    }
  });
  
  const score = (correct / refWords.length) * 100;
  return Math.round(score);
}

function Dictaphone({ card }) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [valueTranscript, setValueTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const lastTranscriptRef = useRef('');
  const [showReferenceText, setShowReferenceText] = useState(false);

  function cleanHtml (html){
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Récupération le content de la card : back/front (bug html)
  const frontSide = card?.cardSides.find(side => side.side === "front");
  const backSide = card?.cardSides.find(side => side.side === "back");

  // Supp HTML du content texte brut
  const frontContent = cleanHtml(frontSide?.cardBlock?.content || "");
  const backContent = cleanHtml(backSide?.cardBlock?.content || "");

  const referenceText = backContent.trim() !== "" ? backContent : frontContent || "Pas de contenu de référence";

  // Mise à jour du texte dans le textarea en fonction de la reconnaissance vocale
  useEffect(() => {
    if (!transcript) return;
    
    const last = lastTranscriptRef.current;
    if (transcript.startsWith(last)) { 
      const newPart = transcript.slice(last.length);
      setValueTranscript((prev) => prev + newPart);
      lastTranscriptRef.current = transcript;
    } else {
      lastTranscriptRef.current = transcript;
    }
  }, [transcript]);

  const handleChange = (event) => {
    setValueTranscript(event.target.value);
  };
  const handleCheck = () => {
    setIsChecking(true);
    const result = compareTexts(referenceText, valueTranscript);
    setScore(result);
    setTimeout(() => setIsChecking(false), 1000);
  };
  const handleToggleReferenceText = () => {
    setShowReferenceText(!showReferenceText);
  };
  // Condition si ce n'est pas compatible avec tous les navigateurs comme opéra, firefox et autres
  if (!browserSupportsSpeechRecognition) {
    return (
      <Card elevation={3} sx={{ minHeight: 300, mb: 3 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Navigateur non compatible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Votre navigateur ne supporte pas la reconnaissance vocale.
            Veuillez utiliser Chrome, Edge ou Safari.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
       {/* Bouton pour montrer/cacher le texte de référence */}
       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={showReferenceText ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={handleToggleReferenceText}
          color="primary"
        >
          {showReferenceText ? 'Cacher le texte' : 'Montrer le texte'}
        </Button>
      </Box>

      {/* Carte avec le texte de référence (côté back/front) */}
      {showReferenceText &&(
        <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Texte à prononcer
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {referenceText}
          </Typography>
        </CardContent>
      </Card>
      )}

      {/* Contrôles du microphone */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<MicIcon />}
          onClick={SpeechContinue}
          disabled={listening}
        >
          Démarrer
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={SpeechRecognition.stopListening}
          disabled={!listening}
        >
          Arrêter
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => {
            resetTranscript();
            setValueTranscript('');
            setIsChecking(false);
            lastTranscriptRef.current = '';
            setScore(null);
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Indicateur d'état du microphone */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Chip
          label={listening ? 'Microphone activé' : 'Microphone désactivé'}
          color={listening ? 'success' : 'default'}
          variant={listening ? 'filled' : 'outlined'}
        />
      </Box>

      {/* Zone de texte pour la transcription */}
      <TextField
        fullWidth
        multiline
        rows={6}
        value={valueTranscript}
        onChange={handleChange}
        placeholder="Votre prononciation apparaîtra ici"
        variant="outlined"
        sx={{ mb: 3 }}
      />

      {/* Bouton de vérification et résultat */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={handleCheck}
          disabled={!valueTranscript.trim() || isChecking}
          sx={{ mb: 2 }}
        > 
          {isChecking ? 'Vérification...' : 'Vérifier la prononciation'}
        </Button>

        {score !== null && (
          <Box>
            <Typography variant="h6" color={score >= 80 ? 'success.main' : 'warning.main'}>
              Score de correspondance : {score}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {score >= 80 
                ? 'Excellent ! Votre prononciation est très bonne.' 
                : score >= 60 
                ? 'Bien ! Continuez à vous entraîner.'
                : 'Entraînez-vous encore un peu pour améliorer votre prononciation.'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Dictaphone;