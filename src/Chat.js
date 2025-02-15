import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import "./css/chat.css";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // Carica i messaggi salvati all'avvio
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        setMessages(savedMessages);
    }, []);

    // Scorrimento automatico all'ultimo messaggio
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Funzione per inviare un messaggio
    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "Tu"
        };

        const updatedMessages = [...messages, newMessage];

        setMessages(updatedMessages);
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        setInput("");
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Ultimo accesso...</p>
                </div>

                <div className="header__right">
                    <IconButton><SearchIcon /></IconButton>
                    <IconButton><AttachFileIcon /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((msg, index) => (
                    <p key={index} className={`chat__message ${msg.sender === "Tu" ? "chat__receiver" : ""}`}>
                        <span className="chat__name">{msg.sender}</span>
                        {msg.text}
                        <span className="chat__time">{msg.time}</span>
                    </p>
                ))}
                <div ref={chatEndRef} /> {/* Aiuta lo scrolling automatico */}
            </div>

            <div className="chat__footer">
                <EmojiEmotionsIcon />
                <AttachFileIcon />
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
