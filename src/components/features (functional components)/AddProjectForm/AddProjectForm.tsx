import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase/firebase";
import { useState } from "react";
import { nanoid } from "nanoid";

export const AddProjectForm = () => {
  const [title, setTitle] = useState("");
  const [user] = useAuthState(auth);

  const handleAdd = async () => {
    if (!user || !title.trim()) return;

    await addDoc(collection(db, "projects"), {
      title,
      createdBy: user.uid,
      inviteKey: nanoid(6),
      members: [user.uid],
    });

    setTitle("");
  };

  const handleDeleteProjectByTitle = async () => {
    if (!user || !title.trim()) return;

    const q = query(collection(db, "projects"), where("title", "==", title), where("createdBy", "==", user.uid));
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, "projects", docSnap.id));
    }

    setTitle("");
  };

  return (
    <div className="list column">
      <input placeholder="Project name" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="list">
        <button className="btn" onClick={handleAdd}>Create</button>
        <button className="btn" onClick={handleDeleteProjectByTitle}>Delete</button>
      </div>
    </div>
  );
};
