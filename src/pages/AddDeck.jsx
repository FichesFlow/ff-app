import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import {useDocumentTitle} from '../hooks/useDocumentTitle.js'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

const plugins = [
  headingsPlugin(),
  codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
  codeMirrorPlugin({
    codeBlockLanguages: {js: 'JavaScript', ts: 'TypeScript', css: 'CSS'}
  }),
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
            contents: () => <CodeToggle/>
          },
          {
            fallback: () => (
              <>
                <UndoRedo/>
                <BlockTypeSelect/>
                <Separator/>
                <BoldItalicUnderlineToggles/>
                <InsertThematicBreak/>
                <Separator/>
                <CreateLink/>
                <InsertTable/>
                <InsertCodeBlock/>
                <InsertImage/>
                <Separator/>
                <ListsToggle/>
                <DiffSourceToggleWrapper/>
              </>
            )
          }
        ]}
      />
    )
  })
]

export default function AddDeck() {
  useDocumentTitle('Ajouter un deck – FichesFlow')

  return (
    <Container
      maxWidth="lg"
      sx={{mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
    >
      <Box bgcolor="#fff" p={2} borderRadius={1} boxShadow={3} mt={4} width="100%">
        <MDXEditor markdown="# Hello world" plugins={plugins}/>
      </Box>
    </Container>
  )
}
