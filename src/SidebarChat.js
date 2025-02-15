import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./css/sidebar.css";

function SidebarChat({ addnewchat, name, lastMessage, avatar, onClick }) {
    const [seed, setSeed] = useState("");

    // Setta un avatar casuale se non specificato
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    return (
        !addnewchat ? (
            <div className="sidebar__chat" onClick={onClick}>
                <Avatar src={avatar || `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`} />
                <div className="sidebar__chatInfo">
                    <h2>{name || "Chat senza nome"}</h2>
                    <p>{lastMessage || "No messages yet..."}</p>
                </div>
            </div>
        ) : (
            <div className="sidebar__chat" onClick={onClick}>
                <h2>Aggiungi nuova chat</h2>
            </div>
        )
    );
}

export default SidebarChat;
