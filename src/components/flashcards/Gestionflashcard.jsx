import React, { useState } from 'react';
import FicheEditor from '../fiches/FicheEditor';
import OutlinedCard from './flashcard';
import { Button, Box, Snackbar, Alert } from '@mui/material';


export default function FlashcardGestion() {
  const [flashcards, setFlashcards] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);


// constante pour gérer l'ajout d'une flashcard 
  const gestion_Add_Flashcard = ({ sujet, niveau, description,theme }) => {
    // constante qui va prendre le milieu du texte markdown
    const midtext = Math.floor(description.length / 2);
    // variable permettant de coupé à un retour à la ligne, pour éviter une coupure dans un mot
    let moitie_description = description.lastIndexOf("\n", midtext);
    // condition si on trouve pas la un retour a la ligne alors on coupe dans un espace
    if (moitie_description === -1) moitie_description = description.lastIndexOf(" ", midtext);
    // condition si il n'y a ni retour a la ligne ou d'espace
    if (moitie_description === -1) moitie_description = midtext;

    const description_recto = description.slice(0, moitie_description).trim();
    const description_verso = description.slice(moitie_description).trim();

    setFlashcards(prev => [...prev, {
      sujet,
      niveau,
      theme,
      description_recto,
      description_verso,
    }]);
  };
  const envoyerToutesLesFlashcards = async () => {
    try {
      // Vu que par defaut il n'y a pas de deck existant, et que deck, created_at, updated_at ne peuvent pas etre null
      //  alors il faut init ici via la method Post mais pour api/decks
      const deckRes = await fetch("https://localhost/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
          title: "Deck généré automatiquement",
        }),
      });

      if (!deckRes.ok) {
        console.error("Erreur lors de la création du deck :", await deckRes.text());
        return;
      }

      const deckData = await deckRes.json();
      const deckId = deckData['@id'];
      //  method Post pour api/cards 
      for (const card of flashcards) {
        const reponse = await fetch("https://localhost/api/cards",{
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
          sujet: card.sujet,
          niveau: card.niveau,
          theme: card.theme,
          recto: card.description_recto,
          verso: card.description_verso,
          deck: deckId,
        }),
      });
      if (!reponse.ok) {
        console.error("L'envoi n'a pas marché :", await reponse.text());
      }
    }
    setAlertOpen(true);
    } 
    catch (error) {
      console.error("Error lors de l'envoi global:", error);
    }
  };

  return (
    <div>
      <FicheEditor onAddFlashcard={gestion_Add_Flashcard} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
        {flashcards.map((card, index) => (
          <OutlinedCard key={index} {...card} />
        ))}
      </div>
       {/* Bouton Envoyer (visible uniquement s'il y a des flashcards) */}
       {flashcards.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="success" onClick={envoyerToutesLesFlashcards}>
            Envoyer toutes les flashcards
          </Button>
        </Box>
      )}
      {/* Snackbar pour confirmation */}
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ width: '100%' }}>
          Flashcards envoyées avec succès !
        </Alert>
      </Snackbar>
    </div>
  );
}
