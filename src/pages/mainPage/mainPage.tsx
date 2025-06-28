import { AddProjectForm } from "../../components/features (functional components)/AddProjectForm/AddProjectForm";
import { JoinProjectForm } from "../../components/features (functional components)/JoinProjectForm/JoinProjectForm";
import { ProjectList } from "../../components/common (general)/ProjectList/ProjectList";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import GroupChat from "../../components/features (functional components)/GroupChat/GroupChat";
import { ProjectTask } from "../../components/features (functional components)/ProjectTask/ProjectTask";
import { ProjectUsersList } from "../../components/common (general)/ProjectUserList/ProjectUserList";
import { useState } from "react";
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { TUsersInProject } from "../../types/types";
import Chart from "../../components/common (general)/Recharts/Chart";

function MainPage() {
  const [user] = useAuthState(auth);
  const [usersInProject, setUsersInProject] = useState<TUsersInProject[]>([]);
  const [tasksInProject, setTasksInProject] = useState<any []>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [groupChatProjectId, setGroupChatProjectId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Exit error:", error);
    }
  };

  return (
    <div className="main-page">
      <section className="profile-area area">
        <div className="user">
          <span className="user-name">{user?.email}</span>
          <button className="logout btn mini" onClick={handleLogout}>Logout</button>
        </div>
        <ul className="list column">
          <AddProjectForm />
          <JoinProjectForm />
          <ProjectList onSelectProject={setSelectedProjectId} onOpenChat={setGroupChatProjectId}/>
          <div className="list row">
            {tasksInProject.length > 0 && <Chart tasks={tasksInProject} />}
          </div>
        </ul>
      </section>

      <section className="content-area area">
        <div className="tasks list column">
          {selectedProjectId && <ProjectTask projectId = {selectedProjectId} usersInProject = {usersInProject} tasksRechart = {setTasksInProject} />}
        </div>
        <div className="chat">
          {groupChatProjectId && user?.uid && user?.email && (<GroupChat projectId = {groupChatProjectId} currentUser = {{ uid: user.uid, email: user.email }}/>)}
        </div>
      </section>

      <section className="users-area area">
        {selectedProjectId && <ProjectUsersList projectId = {selectedProjectId} onUsersInProject = {setUsersInProject} />}
      </section>
    </div>
  );
}

export default MainPage;
