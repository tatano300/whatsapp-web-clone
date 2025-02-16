import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';

function App() {
  const [chats, setChats] = useState([
    { id: 1, name: "React Tutorial", lastMessage: "No messages yet...", avatar: "https://i.pravatar.cc/300?img=1" },
    { id: 2, name: "Chat con Luca", lastMessage: "No messages yet...", avatar: "https://i.pravatar.cc/300?img=2" },
    { id: 3, name: "Giulia", lastMessage: "No messages yet...", avatar: "https://i.pravatar.cc/300?img=3" },
]);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const updateLastMessage = (chatId, message) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, lastMessage: message } : chat
      )
    );
  };

  const addNewChat = (name) => {
    if (!name) return;
    const newChat = {
      id: chats.length + 1,
      name: name,
      lastMessage: "Nuova chat creata!",
      avatar: `https://i.pravatar.cc/300?img=${chats.length + 1}`,
    };
    setChats([...chats, newChat]);
  };


  return (
    <div className='App'>
      <div className='app__body'>
        <Sidebar chats={chats} onSelectChat={handleSelectChat} addNewChat={addNewChat} />
        {selectedChat ? (
          <Chat selectedChat={selectedChat} updateLastMessage={updateLastMessage} />
        ) : (
          <div className="chat-placeholder">Seleziona una chat per iniziare una conversazione</div>
        )}
      </div>
    </div>
  );
}

export default App;
