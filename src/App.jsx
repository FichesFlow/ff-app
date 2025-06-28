import React from "react";
import FicheEditor from "./components/fiches/FicheEditor";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center p-4">Éditeur</h1>
      <FicheEditor/>
    </div>
  );
}

export default App;
