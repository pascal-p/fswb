import { useState, useEffect } from 'react';

import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

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
    const resp = await fetch('http://localhost:5001/tasks');
    const data = await resp.json();
    
    return data;
  }  
  
  // Add a task
  const addTask = (task) => {
    const id = Math.floor(Math.random() * 10000) + 1;
    const newTask = {id, ...task};
    setTasks([...tasks, newTask]);
  }

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  // Toggle reminder
  const toggleReminder = (id) => {
    setTasks(tasks.map((t) => t.id === id ? {...t, reminder: !t.reminder} : t));
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
