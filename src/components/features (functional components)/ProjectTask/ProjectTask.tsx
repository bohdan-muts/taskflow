import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TUsersInProject } from "../../../types/types";
import { formatDateForDisplay } from "../../../utils/FormatData";
import TaskStatsChart from "../../common (general)/Recharts/Chart";

type Props = {
  projectId: string;
  usersInProject: TUsersInProject[];
  tasksRechart: (tasks: any[]) => void;
};

const columnsFromTypes = {
  todo: "All",
  inProgress: "In progress",
  done: "Done",
};

export const ProjectTask = ({ projectId, usersInProject, tasksRechart}: Props) => {
  const [task, setTask] = useState("");
  const [doneDate, setDoneDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const q = query(collection(db, `projects/${projectId}/tasks`), orderBy("createdAt", "asc"));
    return onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTasks(taskData);
      tasksRechart(taskData)
    });
  }, [projectId]);

  const handleAddTask = async () => {
    if (!task.trim()) return;
    await addDoc(collection(db, `projects/${projectId}/tasks`), {
      text: task,
      doneDate,
      priority,
      status: "todo",
      createdAt: serverTimestamp(),
      assignedTo: assignedTo || null
    });
    setTask("");
    setDoneDate("");
    setPriority("low");
    setAssignedTo("");
  };

  const handleDeleteTask = async (id: string) => {
    await deleteDoc(doc(db, `projects/${projectId}/tasks`, id));
  };

  const handleEditTask = async (id: string) => {
    if (!editingText.trim()) return;
    await updateDoc(doc(db, `projects/${projectId}/tasks`, id), {
      text: editingText,
    });
    setEditingId(null);
    setEditingText("");
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    await updateDoc(doc(db, `projects/${projectId}/tasks`, draggableId), {
      status: destination.droppableId
    });
  };

  return (
    <>
      <h4>Tasks</h4>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="tasks-board">
          {Object.entries(columnsFromTypes).map(([status, title]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="to-do-column">
                  <h5 className="title">{title}</h5>
                  <div className="list">
                    {tasks.filter((t) => t.status === status).map((t, idx) => (
                      <Draggable key={t.id} draggableId={t.id} index={idx}>
                        {(prov) => (
                          <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="task">
                            {editingId === t.id ? (
                              <>
                                <input value={editingText} onChange={(e) => setEditingText(e.target.value)} style={{ margin: "0 0 5px 0" }}/>
                                <button className="btn mini" onClick={() => handleEditTask(t.id)} style={{ margin: "0 5px 0 0" }}>✔</button>
                                <button className="btn mini" onClick={() => setEditingId(null)}>✖</button>
                              </>
                            ) : (
                              <>
                                <span className={`priority ${t.priority === "high" ? "red" : t.priority === "medium" ? "orange" : "green"}`}></span>
                                <div className="wrapper list column">
                                  <p className="text"><strong>Task: <br /></strong>{t.text}</p>
                                  <p className="until-date"><strong>Until: </strong>{t.doneDate ? formatDateForDisplay(t.doneDate) : "Unset"}</p>
                                  <p className="assigned-to"><strong>Assigned to: <br /></strong>{t.assignedTo || "—"}</p>
                                </div>
                                <button className="btn mini" onClick={() => { setEditingId(t.id); setEditingText(t.text); }} style={{ margin: "0 5px 0 0" }}>✎</button>
                                <button className="btn mini" onClick={() => handleDeleteTask(t.id)}>🗑</button>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <div className="list row">
        <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New task" />
        <input type="date" value={doneDate} onChange={(e) => setDoneDate(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">—</option>
          {usersInProject.map((u) => (
            <option key={u.uid} value={u.email}>
              {u.email}
            </option>
          ))}
        </select>
        <button className="mini btn" onClick={handleAddTask}>Add</button>
      </div>
    </>
  );
};
