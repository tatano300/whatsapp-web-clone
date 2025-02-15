import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';

function App() {
  const [selectedChat, setSelectedChat] = useState(null); // stato per memorizzare la chat selezionata

  // Funzione per gestire la selezione di una chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat); // memorizza la chat selezionata nello stato
  };

  return (
    <div className='App'>
      <div className='app__body'>
        <Sidebar onSelectChat={handleSelectChat} /> {/* Passa la funzione come prop */}
        <Chat selectedChat={selectedChat} /> {/* Passa la chat selezionata a Chat */}
      </div>
    </div>
  );
}

export default App;

