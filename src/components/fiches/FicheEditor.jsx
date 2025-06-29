import React from "react";
import MDEditor from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';
import { commands } from '@uiw/react-md-editor';


export default function FicheEditor({onAddFlashcard}) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");
  const [sujet, setSujet] = React.useState("");
  const [niveau, setNiveau] = React.useState("");
  const [theme, setTheme] = React.useState("");

  {/* fonction gestion d'erreur*/}
  const gestion_add_click = () => {
    if (!sujet || !niveau || !value) {
      setError("Les champs doivent être remplis");
      return;
    }
    {/*Prend les valeurs actuelles de sujet, niveau et value(editeur markdown) */}
    onAddFlashcard({
      sujet,
      niveau,
      theme,
      description : value,
    });
    {/*Reset les valeurs actuelles*/}
    setSujet("");
    setNiveau("");
    setValue("");
    setTheme("");
    setError("");
  }
  {/* Constante prenant en compte les formules mathématique.*/}
  const mathsKaTex = `This is to display the 
\`\$\$\c = \\pm\\sqrt{a^2 + b^2}\$\$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`
`;
{/* Constante ajoutant le boutons pour convertir une formule de maths.*/}
const katexInline = {
  name: "katex_inline",
  keyCommand: "katex_inline",
  buttonProps: { "aria-label": "Insérer formule KaTeX inline" },
  icon: (
    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
      𝑓<sub>𝑥</sub>
    </span>
  ),
  execute: (state, api) => {
    const selectedText = state.selectedText || "c = \\pm\\sqrt{a^2 + b^2}";
    const formatted = `\`$$${selectedText}$$\``;
    api.replaceSelection(formatted);
  },
};
{/* gestion d'erreur liée au nombre de caractere*/}
  const ErreurcaractereMax = (value) => {
    if (value.length > 1500) {
      setError ("Vous avez dépassé le nombre de caractère")
    } else {
      setError("");
      setValue(value)
    }
  }
  return (
    <div className="container">
      <label>
        Discipline Niveau: <input name="discipline_niveau input" value={niveau} onChange={e => setNiveau(e.target.value)} />
        <hr/>
        <br />
        Matière: <input name="Sujet_input" value={sujet} onChange={e => setSujet(e.target.value)} />
        <hr/>
        <br />
        Thème : <input value={theme} onChange={e => setTheme(e.target.value)} />
  <hr/><br />
      </label>
      <MDEditor
        value={value}
        onChange={ErreurcaractereMax}
        textareaProps={{
          placeholder: "Edite t'as fiche",
        }}
        commands={[
          ...commands.getCommands(),
          commands.divider,
          katexInline,
        ]}
        previewOptions={{
          components: {
            code: ({ children = [], className, ...props }) => {
              const rawCode = Array.isArray(children) ? children[0] : children;
            
              // Cas 1 : formule inline avec $$...$$
              if (typeof rawCode === 'string' && /^\$\$(.*)\$\$/.test(rawCode)) {
                const math = rawCode.replace(/^\$\$(.*)\$\$/, '$1');
                const html = katex.renderToString(math, { throwOnError: false });
                return (
                  <code
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{ background: 'transparent' }}
                  />
                );
              }
              // Cas 2 : bloc de maths marqué ```katex``` mais ne marche pas
              if (
                typeof rawCode === 'string' &&
                typeof className === 'string' &&
                /^language-katex/.test(className.toLowerCase())
              ) {
                const html = katex.renderToString(rawCode, { throwOnError: false });
                return (
                  <code
                    style={{ fontSize: '150%' }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              }
            
              // Cas par défaut
              return <code className={String(className)}>{rawCode}</code>;
            }
          },
        }}
      />
      {/* ligne pour mettrre le message d'erreur en couleur rouge*/}
       {error && <p style={{ color: "red" }}>{error}</p>}
        {/* ligne pour mettre une preview en dessous de l'editeur*/}
      {/*<MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} /> */}
      <button type="button" onClick={gestion_add_click}>Ajoute Flashcard</button>
      <button type="button">Suite Flashcard</button>
    </div>
  );
}

