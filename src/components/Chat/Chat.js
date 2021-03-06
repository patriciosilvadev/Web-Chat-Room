import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, Search } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useStateValue } from '../../DataLayer/StateProvider';
import db from '../../firebase';
import "./Chat.css";
import firebase from "firebase";


function Chat() {

    const [seed, setSeed] = useState("");
    const [Input, setInput] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = useStateValue();


    useEffect(() => {
        if (roomId) {
            db.collection("rooms").doc(roomId).onSnapshot(snapshot => (setRoomName(snapshot.data().name)));

            db.collection('rooms').doc(roomId).collection("messages").orderBy('timestamp', 'asc').onSnapshot(snapshot =>(
                setMessages(snapshot.docs.map((doc) =>
                doc.data()))
            ));
        }
    }, [roomId]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 6000));
    }, [])

    // const 

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('rooms').doc(roomId).collection('messages').add({
            message: Input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("")
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>
                        last seen {""}
                        {new Date(
                            messages[messages.length-1]?.timestamp?.toDate()).toUTCString()
                        }
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <Search />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">

            {messages.map(message =>(
                 <p className={`chat__message ${message.name === user.displayName && 'chat__reciever'}`}>
                    <span className="chat__name">{message.name}</span>
                {message.message}
                <span className="chat__timestamp">
                    {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
                </p>
            ))}
                

            </div>
            <div className="chat__footer">
                <InsertEmoticon />
                <form >
                    <input onChange={(e) => setInput(e.target.value)} value={Input} type="text" placeholder="Type a message " />
                    <button type="submit" onClick={sendMessage}>Send</button>
                </form>
                <Mic />

            </div>
        </div>
    )
}

export default Chat
