
import React, { useState, useCallback } from 'react';
import VimEditor from './components/VimEditor';
import Toolbar from './components/Toolbar';
import { VIM_EDITOR_INITIAL_CONTENT } from './constants';

function App() {
  const [content, setContent] = useState<string>(VIM_EDITOR_INITIAL_CONTENT);
  const [fontSize, setFontSize] = useState<number>(16);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + 2, 40));
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - 2, 10));
  };
  
  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (err) {
      console.error('Async: Could not copy text: ', err);
      return false;
    }
  };


  return (
    <main className="flex flex-col h-screen bg-gray-800 text-gray-200 font-sans">
      <Toolbar 
        onCopy={copyToClipboard}
        onIncreaseFont={increaseFontSize}
        onDecreaseFont={decreaseFontSize}
      />
      <div className="flex-grow w-full overflow-hidden">
        <VimEditor 
          value={content}
          onChange={handleContentChange}
          fontSize={fontSize}
        />
      </div>
    </main>
  );
}

export default App;
