import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GroupdFlashcards from './components/flashcards/GroupdFlashcards';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  //testgroupflashcard
  const demoCards = [
    {
       "sujet": "Histoire",
    "niveau": "Terminale",
    "theme": "Révolution française",
    "description": "La convocation des États généraux en mai 1789 marque le début de la Révolution."
  },
  {
    "sujet": "Histoire",
    "niveau": "Terminale",
    "theme": "Révolution française",
    "description": "La prise de la Bastille le 14 juillet 1789."
  },
  {
    "sujet": "Histoire",
    "niveau": "Terminale",
    "theme": "Révolution française",
    "description": "L’abolition des privilèges dans la nuit du 4 août 1789 met fin à la société d’ordres."
  },
  {
    "sujet": "Histoire",
    "niveau": "Terminale",
    "theme": "Révolution française",
    "description": "La Déclaration des droits de l’homme et du citoyen."
  },
  ];

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* de test groupflashcard */}
      <div style={{ padding: '2rem' }}>
        <h2>Test GroupedFlashcards</h2>
        <GroupdFlashcards cards={demoCards} />
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
