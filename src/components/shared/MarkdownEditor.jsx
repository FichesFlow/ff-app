import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import {
  MDXEditor,
  headingsPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  diffSourcePlugin,
  imagePlugin,
  tablePlugin,
  linkDialogPlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertTable,
  InsertCodeBlock,
  InsertImage,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  Separator,
  ConditionalContents,
  CodeToggle,
  DiffSourceToggleWrapper,
  jsxPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { Button, Menu, MenuItem, ListItemIcon,ListItemText,Tooltip, IconButton } from '@mui/material'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import PaletteIcon         from '@mui/icons-material/Palette';

const ListeColor = [
  { label: 'Aucun',  hex: null },
  { label: 'Jaune',  hex: '#FFFF00' },
  { label: 'Orange', hex: '#FFA500' },
  { label: 'Rouge',  hex: '#FF0000' },
  { label: 'Vert',   hex: '#008000' },
  { label: 'Bleu',   hex: '#0000FF' },
  { label: 'Violet', hex: '#800080' },
  { label: 'Gris',   hex: '#808080' }
];

// Fonction pour fusionner les styles
// (ajoute ou modifie une propriété CSS dans un style existant)

function mergeStyle(oldStyle = '', prop, value) {
  const styles = {};
  oldStyle      // ← oldStyle vaut maintenant toujours une string
    .split(';')
    .forEach(pair => {
      const [k, v] = pair.split(':').map(s => s.trim()).filter(Boolean);
      if (k && v) styles[k] = v;
    }); 
  if (value === null) delete styles[prop];
  else styles[prop] = value; 
  return Object.entries(styles)
               .map(([k, v]) => `${k}:${v}`)
               .join('; ');
}
// fonction pour appliquer un style à la sélection courante
// (ajoute ou modifie une propriété CSS dans un span autour de la sélection)
function applyStyle(selObj, prop, val, editorRef) {
  const text = selObj?.toString();
  if (!text) return false;

  const span = selObj.anchorNode?.parentElement?.closest('span');
  let html;

  if (span) {
    const merged = mergeStyle(span.getAttribute('style') || '', prop, val);
    html = merged
      ? `<span style="${merged}">${text}</span>`
      : text;                        // plus aucun style -> enlève la balise
  } else if (val !== null) {
    html = `<span style="${prop}:${val};">${text}</span>`;
  } else {
    // « Aucun » alors qu'il n'y avait pas ce style
    return false;
  }

  editorRef.current.insertMarkdown(html + ' ');
  return true;
}

// fonction pour le bouton de menu de couleur 
function ColorMenuButton({ icon, tooltip, cssProp, editorRef, sx }) {
  const [anchor, setAnchor] = React.useState(null);
  const open  = e => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);

  const clickColor = (hex) => {
    if (!editorRef.current) return;

    // bug sur les texte de type "titre" (h1, h2, etc.) : methode pour empecher un disfonctionnement 
    // A retravailler
    const selObj = window.getSelection();
    const headingAncestor =
    selObj?.anchorNode?.parentElement?.closest('h1,h2,h3,h4,h5,h6');

  if (headingAncestor && selObj.anchorOffset === 0) {
    close();                    // on ferme le menu, on ne fait rien
    return;
  }
    editorRef.current.focus?.();

    const ok = applyStyle(window.getSelection(), cssProp, hex, editorRef);
    if (ok) close();
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton size="small" onClick={open} sx={sx}>{icon}</IconButton>
      </Tooltip>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        {ListeColor.map(({ label, hex }) => (
          <MenuItem key={label} onClick={() => clickColor(hex)}>
            <ListItemIcon>
              <span style={{
                display:'inline-block', width:16, height:16,
                backgroundColor: hex ?? 'transparent',
                border:'1px solid #ccc', borderRadius:3
              }}/>
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// fonction pour insérer un surlignage
export function InsertSurlignage({ editorRef }) {
  return (
    <ColorMenuButton
      icon={<FormatColorFillIcon fontSize="small" />}
      tooltip="Surligner"
      cssProp="background-color"
      editorRef={editorRef}
    />
  );
}
// fonction pour insérer une couleur de texte
export function InsertTextColor({ editorRef }) {
  return (
    <ColorMenuButton
      icon={<PaletteIcon fontSize="small" />}
      tooltip="Couleur texte"
      cssProp="color"
      editorRef={editorRef}
      sx={{ ml: 1 }}
    />
  );
}

export default forwardRef(function MarkdownEditor(props, ref) {
  const editorRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getMarkdown: () => editorRef.current?.getMarkdown(),
    setMarkdown: (md) => editorRef.current?.setMarkdown(md)
  }), [])

  const plugins = [
    headingsPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript', css: 'CSS' } }),
    quotePlugin(),
    listsPlugin(),
    thematicBreakPlugin(),
    diffSourcePlugin(),
    imagePlugin(),
    tablePlugin(),
    linkDialogPlugin(),
    toolbarPlugin({
      toolbarContents: () => (
        <ConditionalContents
          options={[
            {
              when: (editor) => editor?.editorType === 'codeblock',
              contents: () => <CodeToggle />
            },
            {
              fallback: () => (
                <>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <InsertThematicBreak />
                  <Separator />
                  <CreateLink />
                  <InsertTable />
                  <InsertCodeBlock />
                  <InsertImage />
                  <Separator />
                  <InsertSurlignage editorRef={editorRef}/>
                  <InsertTextColor editorRef={editorRef}/>
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <DiffSourceToggleWrapper />
                </>
              )
            }
          ]}
        />
      )
    })
  ]

  return (
    <MDXEditor
      ref={editorRef}
      markdown={props.markdown || '# Hello world'}
      plugins={plugins}
    />
  )
})
