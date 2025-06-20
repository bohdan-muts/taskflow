import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { IProject } from "../../../interfaces/interfaces";
import { IProjectListProps } from "../../../interfaces/interfaces";

export const ProjectList = ({ onSelectProject, onOpenChat }: IProjectListProps) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "projects"), where("members", "array-contains", user.uid));

    return onSnapshot(q, async (snapshot) => {
      const fetchedProjects: IProject[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as IProject[];

      setProjects(fetchedProjects);
    });
  }, [user]);

  return (
    <div className="projects">
      <h3>Project's list:</h3>
      <ul className="projects list column">
        {projects.map((proj) => (
          <li key={proj.id}>
            <button className="btn project" onClick={() => [onOpenChat(proj.id), onSelectProject(proj.id)]}>
              {proj.title} — key: {proj.inviteKey}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};