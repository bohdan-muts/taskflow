import { collection, getDocs, query, updateDoc, where, arrayUnion } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../../firebase/firebase";
import { useState } from "react";
  
export const JoinProjectForm = () => {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);
  
  const handleJoin = async () => {
    if (!user) return;
  
    const q = query(collection(db, "projects"), where("inviteKey", "==", key));
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) {
      setMessage("Project not found");
      return;
    }
  
    const doc = snapshot.docs[0];
    await updateDoc(doc.ref, {
      members: arrayUnion(user.uid),
    });
  
    setKey("");
  };
  
  return (
    <div className="list column">
      <input placeholder="Project code" value={key} onChange={(e) => setKey(e.target.value)} />
      <button className="btn" onClick={handleJoin}>Join</button>
      <p>{message}</p>
    </div>
  );
};