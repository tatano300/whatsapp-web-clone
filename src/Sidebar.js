import React, { useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import "./css/sidebar.css";
import SidebarChat from "./SidebarChat";

function Sidebar({ onSelectChat }) {
    const [chats, setChats] = useState([
        { id: 1, name: "React Tutorial", lastMessage: "Ciao, come va?", avatar: "https://i.pravatar.cc/300?img=1" },
        { id: 2, name: "Chat con Luca", lastMessage: "Ci vediamo dopo!", avatar: "https://i.pravatar.cc/300?img=2" },
        { id: 3, name: "Giulia", lastMessage: "Ho inviato i documenti.", avatar: "https://i.pravatar.cc/300?img=3" },
    ]);

    // Funzione per aggiungere una nuova chat
    const addNewChat = () => {
        const name = prompt("Inserisci il nome della chat:");
        if (name) {
            const newChat = {
                id: chats.length + 1,
                name: name,
                lastMessage: "Nuova chat creata!",
                avatar: `https://i.pravatar.cc/300?img=${chats.length + 1}`,
            };
            setChats([...chats, newChat]);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton><DonutLargeIcon /></IconButton>
                    <IconButton><ChatIcon onClick={addNewChat} /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input type="text" placeholder="Cerca o avvia una nuova chat" />
                </div>
            </div>

            <div className="sidebar__chats">
                {chats.map(chat => (
                    <SidebarChat 
                        key={chat.id} 
                        name={chat.name} 
                        lastMessage={chat.lastMessage} 
                        avatar={chat.avatar} 
                        onClick={() => onSelectChat(chat)} 
                    />
                ))}
                <SidebarChat addnewchat onClick={addNewChat} />
            </div>
        </div>
    );
}

export default Sidebar;

