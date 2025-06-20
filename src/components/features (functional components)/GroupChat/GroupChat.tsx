import { useEffect, useState } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { IGroupChatMessage, IGroupChatProps } from "../../../interfaces/interfaces";

const GroupChat = ({ projectId, currentUser }: IGroupChatProps) => {
  const [messages, setMessages] = useState<IGroupChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "projectChats", projectId, "messages"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as IGroupChatMessage[]
      );
    });

    return () => unsubscribe();
  }, [projectId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "projectChats", projectId, "messages"), {
      text,
      senderId: currentUser.uid,
      senderEmail: currentUser.email,
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="group-chat list column">
      <div className="chat-header">
        <h4>Chat</h4>
      </div>
      <ul className="messages">
        {messages.map((msg) => (
          <li key={msg.id} className={msg.senderId === currentUser.uid ? "li-current-message" : "li-message"}>
            <div className={msg.senderId === currentUser.uid ? "current-message" : "message"}>
              <p className="sender">{msg.senderEmail}</p> <p className="text">{msg.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="list">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message"/>
        <button className="btn mini" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChat;
