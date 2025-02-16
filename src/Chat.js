import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import MicIcon from '@mui/icons-material/Mic';
import "./css/chat.css";
import StopIcon from "@mui/icons-material/Stop";

function Chat({ selectedChat, updateLastMessage }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Stato per la registrazione vocale
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audioStream, setAudioStream] = useState(null); // Mantiene attivo lo stream audio
    const [permissionGranted, setPermissionGranted] = useState(false); // Permesso al microfono

// Ottenere il microfono all'avvio per ridurre il ritardo
useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => setAudioStream(stream))
        .catch((err) => console.error("Errore nell'accesso al microfono:", err));
}, []);

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

  
     // Convertire il blob in Base64
     const convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    const initializeMicrophone = async () => {
        try {
            console.log("Richiesta permessi per il microfono...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
            setAudioStream(stream);
            setPermissionGranted(true);
            console.log("Microfono attivato con successo.");
        } catch (error) {
            console.error("Errore nell'accesso al microfono:", error);
            setPermissionGranted(false);
        }
    };
    
    const startRecording = async () => {
        if (!permissionGranted || !audioStream) {
            console.log("Il microfono non è ancora disponibile, provo a richiederlo...");
            await initializeMicrophone();
        }
    
        if (!audioStream) {
            console.error("Microfono ancora non disponibile.");
            return;
        }
    
        try {
            console.log("Avvio della registrazione...");
            const recorder = new MediaRecorder(audioStream);
            setMediaRecorder(recorder);
            setAudioChunks([]);
    
            recorder.ondataavailable = (event) => {
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
            };
    
            recorder.start();
            setIsRecording(true);
            console.log("Registrazione avviata.");
        } catch (error) {
            console.error("Errore nell'avviare la registrazione:", error);
        }
    };
  

    // Ferma la registrazione e salva il messaggio vocale
    const stopRecording = () => {
        if (!mediaRecorder) return;

        mediaRecorder.stop();
        setIsRecording(false);

        mediaRecorder.onstop = async () => {
            const completeBlob = new Blob(audioChunks, { type: "audio/webm" });

            // Convertiamo il blob in Base64
            const audioBase64 = await convertBlobToBase64(completeBlob);

            const newMessage = {
                audio: audioBase64,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                sender: "Tu",
                type: "audio"
            };

            const updatedMessages = [...messages, newMessage];

            updateLastMessage(selectedChat.id, "🎤 Messaggio vocale");
            setMessages(updatedMessages);
            localStorage.setItem(`chat_${selectedChat.id}`, JSON.stringify(updatedMessages));

            setAudioChunks([]);
        };
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
                    <IconButton><SearchIcon /></IconButton>
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
                <IconButton onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? <StopIcon /> : <MicIcon />}
                </IconButton>
            </div>
        </div>
    );
}

export default Chat;
