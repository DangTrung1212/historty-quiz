import { MessageSquare } from 'lucide-react';

const ChatBubble = () => {
  const openNotebook = () => {
    window.open(
      'https://notebooklm.google.com/notebook/3efafe6a-9631-4cd1-b4fc-1d5a73a0fc9c',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={openNotebook}
        className="bg-gradient-to-br from-pink-500/90 to-purple-600/90 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105 backdrop-blur-sm"
        title="Open Notebook"
        aria-label="Open Notebook"
      >
        <MessageSquare size={20} className="text-white/90" />
      </button>
    </div>
  );
};

export default ChatBubble;
