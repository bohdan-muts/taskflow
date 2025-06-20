import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, auth } from "../../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IUser } from "../../../interfaces/interfaces";

interface Props {
  projectId: string | null;
  onUsersInProject: ([]) => void;
}

export const ProjectUsersList = ({ projectId, onUsersInProject }: Props) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [user] = useAuthState(auth);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, IUser>>(new Map());

  useEffect(() => {
    if (!projectId || !user) return;

    const fetchProjectUsers = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", projectId));
        if (!projectDoc.exists()) return;

        const projectData = projectDoc.data();
        const members: string[] = projectData.members || [];
        
        setCreatorId(projectData.createdBy || null);

        const usersToShow: IUser[] = [];

        for (const uid of members) {
          if (uid === user.uid) continue;

          if (cacheRef.current.has(uid)) {
            usersToShow.push(cacheRef.current.get(uid)!);
          } else {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              const userData = { uid, ...userDoc.data() } as IUser;
              cacheRef.current.set(uid, userData);
              usersToShow.push(userData);
            }
          }
        }

        setUsers(usersToShow);
        onUsersInProject(usersToShow)
      } catch (err) {
        console.error("Error downloading members:", err);
      }
    };

    fetchProjectUsers();
  }, [projectId, user]);

  const handleRemoveUser = async (uid: string) => {
    if (!projectId) return;
    try {
      await updateDoc(doc(db, "projects", projectId), {
        members: arrayRemove(uid)
      });
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  if (!projectId) return null;

  return (
    <div className="list column">
      <h4>Members:</h4>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            <span>{user.email}</span>
            {creatorId === auth.currentUser?.uid && user.uid !== creatorId && (
              <button onClick={() => handleRemoveUser(user.uid)}>X</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};