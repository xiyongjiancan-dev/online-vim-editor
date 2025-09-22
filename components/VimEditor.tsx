import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vim, Vim } from '@replit/codemirror-vim';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

interface VimEditorProps {
  value: string;
  onChange: (value: string) => void;
  fontSize: number;
}

// Custom theme to override the background to black and adjust selection colors accordingly.
const customTheme = EditorView.theme({
  // Set the main editor background to pure black
  '&': {
    backgroundColor: '#000000',
    color: '#f8f8f2',
  },
  '.cm-gutters': {
    backgroundColor: '#000000',
    borderRight: '1px solid #1c1c1c', // A subtle border for the gutter
    color: '#6272a4',
  },

  // Inverted color effect for the selection
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: '#f8f8f2', // Use Dracula's foreground as selection background
    color: '#000000',          // Use black for selection text color to match the new background
  },

  // Make the cursor visible on top of the light selection background
  '.cm-selectionLayer .cm-cursor, .cm-cursor': {
    borderLeftColor: '#f8f8f2',
  },
});


const VimEditor: React.FC<VimEditorProps> = ({ value, onChange, fontSize }) => {
  const extensions = useMemo(() => {
    let lastYankedText = '';
    const anyVim = Vim as any;

    const vimUpdateListener = EditorView.updateListener.of((update) => {
      // Don't run on every update, only when the view is focused and there might be a change.
      if (!update.view.hasFocus) return;

      try {
        const registerController = anyVim.getRegisterController(update.view);
        if (!registerController) return;

        // The default register is '"'
        const defaultRegister = registerController.getRegister('"');
        if (!defaultRegister || !defaultRegister.text) return;
        
        const yankedText = Array.isArray(defaultRegister.text)
          ? defaultRegister.text.join('\n')
          : defaultRegister.text;

        // If the register has new content, it's a new yank.
        if (yankedText && yankedText !== lastYankedText) {
          lastYankedText = yankedText; // Track the new yanked text

          // Copy to system clipboard
          navigator.clipboard.writeText(yankedText).then(() => {
            const lineCount = defaultRegister.isLinewise 
              ? (Array.isArray(defaultRegister.text) ? defaultRegister.text.length : 1) 
              : 0;
            
            let message = 'yanked to clipboard';
            if (lineCount > 1) {
              message = `${lineCount} lines yanked to clipboard`;
            } else if (lineCount === 1) {
              message = `1 line yanked to clipboard`;
            }
            anyVim.showNotification(update.view, message);

          }).catch(err => {
            console.error("Failed to copy yanked text to clipboard:", err);
            anyVim.showNotification(update.view, 'Failed to copy to clipboard');
          });
        }
      } catch (error) {
        // Fail silently to prevent the editor from crashing on an error within the listener.
        console.error("Error handling yank in Vim update listener:", error);
      }
    });

    return [
      vim(), 
      javascript({ jsx: true }), 
      EditorView.lineWrapping,
      customTheme, // Apply our custom overrides
      vimUpdateListener, // Add our custom listener
    ];
  }, []); // Memoize to prevent re-creating extensions on every render

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={dracula} // Base theme for syntax highlighting
      extensions={extensions}
      onChange={onChange}
      style={{
        fontSize: `${fontSize}px`,
        height: '100%',
      }}
      basicSetup={{
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
      }}
    />
  );
};

export default VimEditor;
