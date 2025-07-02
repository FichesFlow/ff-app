import React, { useState } from 'react';
import FicheEditor from '../fiches/FicheEditor';
import OutlinedCard from './flashcard';

export default function FlashcardGestion() {
  const [flashcards, setFlashcards] = useState([]);

// constante pour gérer l'ajout d'une flashcard 
  const gestion_Add_Flashcard = ({ sujet, niveau, description,theme }) => {
    // constante qui va prendre le milieu du texte markdown
    const midtext = Math.floor(description.length / 2);
    // variable permettant de coupé à un retour à la ligne, pour éviter une coupure dans un mot
    let moitie_description = description.lastIndexOf("\n", midtext);
    // condition si on trouve pas la un retour a la ligne alors on coupe dans un espace
    if (moitie_description === -1) moitie_description = description.lastIndexOf(" ", midpoint);
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

  return (
    <div>
      <FicheEditor onAddFlashcard={gestion_Add_Flashcard} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
        {flashcards.map((card, index) => (
          <OutlinedCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
