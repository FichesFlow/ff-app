import React, { useState } from "react";
import Button from "@mui/material/Button";

export default function AudioPlayer({ texte }) {
  const [enLecture, setEnLecture] = useState(false);
  const [voixEnCours, setVoixEnCours] = useState(null);

  function lireTexte() {

    // Vérifie si le navigateur supporte la synthèse vocale
    if (!("speechSynthesis" in window)) {
        alert("La lecture vocale n'est pas supportée par ce navigateur.");
        return;
      }
    if (texte) {
    if (!enLecture) {
      try {
        const nouvelleVoix = new SpeechSynthesisUtterance(texte);
        // Afaire -> trouvezr une voix française non robotique
        nouvelleVoix.lang = "fr-FR";
        nouvelleVoix.rate = 1.5;
        nouvelleVoix.pitch = 1.5;
        nouvelleVoix.volume = 1;
        // Sélectionne la première voix disponible
        const voixDispos = speechSynthesis.getVoices();
        if (voixDispos.length > 0) {
          nouvelleVoix.voice = voixDispos[0];
        }
        // si la l'audio est terminer -> reset les états des constantes et donc le bouton
        nouvelleVoix.onend = () => {
            setEnLecture(false);
            setVoixEnCours(null);
          };
          // si il y a une erreur de lecture
        nouvelleVoix.onerror = (e) => {
          console.error("Erreur de lecture vocale :", e.error);
          alert("Impossible de lire le texte.");
          setEnLecture(false);
          setVoixEnCours(null);
        };

        speechSynthesis.speak(nouvelleVoix);
        
        setVoixEnCours(nouvelleVoix);
        setEnLecture(true);
      } catch (err) {
        console.error("Erreur :", err);
        alert("Une erreur pendant la lecture.");
        setEnLecture(false);
      }
    } else {
      arreterLecture();
    }
  } else {
    alert("Aucun texte à lire.");
  }
}

  function arreterLecture() {
    if (voixEnCours) {
      speechSynthesis.cancel();
      setVoixEnCours(null);
      setEnLecture(false);
    }
  }

  return !enLecture ? (
    <Button size="small" onClick={lireTexte}>Écouter</Button>
  ) : (
    <Button size="small" onClick={arreterLecture}>Arrêter</Button>
  );
}
