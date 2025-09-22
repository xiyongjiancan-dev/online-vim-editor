
export const VIM_EDITOR_INITIAL_CONTENT = `
-- Welcome to the Online Vim Editor!
--
-- This is a fully functional Vim environment powered by CodeMirror.
--
-- Basic Commands:
-- i          - enter INSERT mode
-- Esc        - enter NORMAL mode
-- :w         - (not implemented, it's a browser!)
-- :q         - (not implemented)
--
-- You can use standard Vim motions:
-- h, j, k, l - for navigation
-- w, b       - move by words
-- 0, $       - move to start/end of line
-- dd         - delete a line
-- yy         - yank (copy) a line
-- p          - paste a line
--
-- Use the toolbar above to:
-- - Copy all content to your clipboard
-- - Increase/decrease the font size
--
-- Start typing below to begin!

function helloWorld() {
  console.log("Hello, Vim!");
}
`;
