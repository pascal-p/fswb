import { useState, useEffect } from 'react';

import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

const URL_SERVER = 'http://localhost:5001';

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    const resp = await fetch(`${URL_SERVER}/tasks`);
    const data = await resp.json();
    return data;
  }

  // Fetch a Task
  const fetchTask = async (id) => {
    const resp = await fetch(`${URL_SERVER}/tasks/${id}`);
    const data = await resp.json();
    return data;
  }

  // Add a task
  const addTask = async (task) => {
    const resp = await fetch(`${URL_SERVER}/tasks`,
                             {
                               method: 'POST',
                               headers: {
                                 'Content-type': 'application/json'
                               },
                               body: JSON.stringify(task)
                             });
    const data = await resp.json();
    setTasks([...tasks, data]);
  }

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`${URL_SERVER}/tasks/${id}`, { method: 'DELETE' });

    setTasks(tasks.filter((t) => t.id !== id));
  }

  // Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const resp = await fetch(`${URL_SERVER}/tasks/${id}`,
                             {
                               method: 'PUT',
                               headers: {
                                 'Content-type': 'application/json'
                               },
                               body: JSON.stringify(updatedTask)
                             });
    const data = await resp.json();

    setTasks(tasks.map((t) => t.id === id ? {...t, reminder: !data.reminder} : t));
  }

  return (
    <div className='container'>
      <Header title='Task Tracker'
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />

      {showAddTask && <AddTask onAdd={addTask}/>}

      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : ( 'No remaining tasks.' ) }
    </div>
  );
}

export default App;
