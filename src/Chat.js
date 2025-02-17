import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import MicIcon from '@mui/icons-material/Mic';
import "./css/chat.css";


function Chat({ selectedChat, updateLastMessage }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
   

    


    useEffect(() => {
        if (selectedChat) {
            const savedMessages = JSON.parse(localStorage.getItem(`chat_${selectedChat.id}`)) || [];
            setMessages(savedMessages);
        }
    }, [selectedChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "Tu",
            type: "text"
        };

        const updatedMessages = [...messages, newMessage];
        //selectedChat.lastMessage=newMessage.text;//MODO SBAGLIATO
        // Aggiorna l'ultimo messaggio nella Sidebar
        updateLastMessage(selectedChat.id, newMessage.text);//MODO CORRETTO
        setMessages(updatedMessages);
        localStorage.setItem(`chat_${selectedChat.id}`, JSON.stringify(updatedMessages));
        setInput("");
    };

    const handleEmojiClick = (emojiData) => {
        setInput((prevInput) => prevInput + emojiData.emoji);
      };

  
      const handleSearchClick = () => {
        setShowSearch(!showSearch);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };


    
            

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={selectedChat.avatar} />
                <div className="chat__headerInfo">
                    <h3>{selectedChat.name}</h3>
                    <p>Ultimo accesso...</p>
                </div>

                <div className="header__right">
                    <IconButton onClick={handleSearchClick}>
                        <SearchIcon />
                    </IconButton>
                    {showSearch && (
    <input 
        type="text" 
        placeholder="Cerca nei messaggi" 
        value={searchTerm} 
        onChange={handleSearch} 
        className="chat__searchInput" 
        style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
    />
)}
                    <IconButton><AttachFileIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((msg, index) => (
                    <p key={index} className={`chat__message ${msg.sender === "Tu" ? "chat__receiver" : ""}`}>
                        <span className="chat__name">{msg.sender}</span>
                        {msg.type === "text" ? (
                            msg.text
                        ) : (
                            <audio controls>
                                <source src={msg.audio} type="audio/webm" />
                                Il tuo browser non supporta il tag audio.
                            </audio>
                        )}
                        <span className="chat__time">{msg.time}</span>
                    </p>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="chat__footer">
            <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <EmojiEmotionsIcon />
            </IconButton>
            {showEmojiPicker && (
             <EmojiPicker onEmojiClick={handleEmojiClick} />
             )}
                <form onSubmit={sendMessage}>
                    <input 
                        type="text" 
                        placeholder="Scrivi un messaggio..." 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" hidden>Invia</button>
                </form>
                
               <MicIcon />
                
            </div>
        </div>
    );
}

export default Chat;
