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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openNotebook}
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Open Notebook"
        aria-label="Open Notebook"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default ChatBubble;
