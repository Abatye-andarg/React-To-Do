import { useState, useEffect } from 'react';
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";


import './Upper.css';
function Upper({ user }) {
    const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const userTasksRef = user ? doc(db, "tasks", user.uid) : null;

  // Load tasks from Firestore on mount
  useEffect(() => {
    if (!userTasksRef) return;
    const fetchTasks = async () => {
      try {
        const docSnap = await getDoc(userTasksRef);
        if (docSnap.exists()) {
          const loadedTasks = docSnap.data().tasks || [];
          // Only update state if tasks are different to prevent infinite loop
          if (JSON.stringify(loadedTasks) !== JSON.stringify(tasks)) {
            setTasks(loadedTasks);
            console.log("Loaded tasks from Firestore:", loadedTasks);
          } else {
            console.log("Loaded tasks from Firestore (no change):", loadedTasks);
          }
        } else {
          console.log("No tasks found for user in Firestore.");
        }
      } catch (error) {
        console.error("Error loading tasks from Firestore:", error);
      }
    };
    fetchTasks();
  }, [userTasksRef]);



    function handleInput(event) {
        setNewTask(event.target.value);
    }


    const saveTasks = (updatedTasks) => {
        if (userTasksRef && user) {
            setDoc(userTasksRef, { tasks: updatedTasks })
                .then(() => {
                    console.log("Tasks saved to Firestore (immediate):", updatedTasks);
                })
                .catch((error) => {
                    console.error("Error saving tasks to Firestore (immediate):", error);
                });
        }
    };

    const add = () => {
        if (newTask.trim() !== "") {
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            saveTasks(updatedTasks);
            setNewTask("");
        }
    };


    const remove = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };


    const moveUp = (index) => {
        if (index >= 1) {
            const update = [...tasks];
            [update[index], update[index - 1]] = [update[index - 1], update[index]];
            setTasks(update);
            saveTasks(update);
        }
    };


    const moveDown = (index) => {
        if (index < tasks.length - 1) {
            const update = [...tasks];
            [update[index], update[index + 1]] = [update[index + 1], update[index]];
            setTasks(update);
            saveTasks(update);
        }
    };


    return (
        <>

            <h1>
                What is the Plan for Today?
            </h1>
            <div>
                <input value={newTask} type="text"
                    placeholder="Enter task"
                    className="input-todo"
                    onChange={handleInput}
                />
                <button className="add-todo" onClick={add}>Add ToDo</button>
            </div>
          <div className="results">
  <div className="result">
    {tasks.length > 0 ? (
      tasks.map((task, index) => (
        <div className="action-list" key={index}>
          <span className="task">{task}</span>
          <button className="up" onClick={() => moveUp(index)}>Up</button>
          <button className="down" onClick={() => moveDown(index)}>Down</button>
          <button className="remove" onClick={() => remove(index)}>Delete</button>
        </div>
      ))
    ) : (
      <p style={{ color: "white" }}>No tasks yet.</p>
    )}
  </div>
</div>

        </>
    );

}
export default Upper
