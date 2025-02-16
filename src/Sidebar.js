import React, {useState} from "react";
import { Avatar, IconButton } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import "./css/sidebar.css";
import SidebarChat from "./SidebarChat";

function Sidebar({chats, onSelectChat, addNewChat}) {

    const [searchTerm, setSearchTerm] = useState("");

     // Filtriamo le chat in base al termine di ricerca
     const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleAddChat = () => {
        const name = prompt("Inserisci il nome della chat:");
        if (name) {
          addNewChat(name); // Chiamiamo la funzione passata da App.js
        }
      };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton><DonutLargeIcon /></IconButton>
                    <IconButton><ChatIcon onClick={handleAddChat} /></IconButton>
                    <IconButton><MoreVertIcon /></IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Cerca una chat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="sidebar__chats">
                {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                        <SidebarChat 
                            key={chat.id} 
                            name={chat.name} 
                            lastMessage={chat.lastMessage} 
                            avatar={chat.avatar} 
                            onClick={() => onSelectChat(chat)} 
                        />
                    ))
                ) : (
                    <p className="no-results">Nessuna chat trovata</p>
                )}
            </div>
        </div>
    );
}

export default Sidebar;

