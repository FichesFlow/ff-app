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
                <Separator/>
                <DiffSourceToggleWrapper/>
              </>
            )
          }
        ]}
      />
    )
  })
]

export default function MarkdownEditor() {
  return <MDXEditor markdown="# Hello world" plugins={plugins}/>
}