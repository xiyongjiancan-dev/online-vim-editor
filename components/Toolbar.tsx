
import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface ToolbarProps {
  onCopy: () => Promise<boolean>;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onCopy, onIncreaseFont, onDecreaseFont }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = async () => {
    const success = await onCopy();
    if(success) {
      setCopyStatus('success');
    } else {
      setCopyStatus('error');
    }
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <header className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700 shadow-md h-16">
      <div className="flex items-center">
        <img src="https://picsum.photos/40/40" alt="logo" className="w-10 h-10 rounded-full mr-4" />
        <h1 className="text-xl font-bold text-gray-100 tracking-wider">Online Vim Editor</h1>
      </div>
      <div className="flex items-center gap-2">
        {copyStatus === 'success' && <span className="text-green-400 text-sm mr-2 transition-opacity duration-300">Copied!</span>}
        {copyStatus === 'error' && <span className="text-red-400 text-sm mr-2 transition-opacity duration-300">Failed!</span>}
        <button onClick={handleCopy} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105">
          <CopyIcon />
          <span>Copy</span>
        </button>
        <div className="flex items-center gap-1 ml-4">
          <span className="text-sm font-medium mr-2">Font Size:</span>
          <button onClick={onDecreaseFont} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200">
            <MinusIcon />
          </button>
          <button onClick={onIncreaseFont} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200">
            <PlusIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
